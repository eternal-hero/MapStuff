import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import fetch from "isomorphic-unfetch";
import * as Realm from "realm-web";
import "../styles/globals.css";
import "../styles/mapbox.css";

import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import App from "next/app";
// import { Provider } from "next-auth/client";

// import { getSession } from "next-auth/client";

import apolloClient from "../lib/apollo-client";
import { USER_UPDATE_ONE_MUTATION } from "../graphql/user.mutation";
/* CD (EV on 20210212): Import USER_INSERT_ONE_MUTATION grapql */
import { USER_INSERT_ONE_MUTATION } from "../graphql/registration/user.mutation";
/* CD (EV on 20210212): Import APP_INSERT_ONE_MUTATION grapql */
import { APP_INSERT_ONE_MUTATION } from "../graphql/registration/app.mutation";
import { USER_ID_QUERY } from "../graphql/user.query";
const GRAPHQL_URL = `https://realm.mongodb.com/api/client/v2.0/app/${process.env.REALM_APP_ID}/graphql`;
import { useRouter } from "next/router";

import en from "../translations/en.json";
import fr from "../translations/fr.json";
import { UserProvider, getSession } from "@auth0/nextjs-auth0";
import { TranslationWrapper } from "../components/context/TranslationContext";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";

// // Connect to your MongoDB Realm app
const app = new Realm.App(process.env.REALM_APP_ID);

i18next.use(initReactI18next).init({
  fallbackLng: "en",
  resources: {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
  },
});

async function loginCustomJwt(jwt) {
  // Create a Custom JWT credential
  const credentials = Realm.Credentials.jwt(jwt);
  try {
    // Authenticate the user
    const user = await app.logIn(credentials);
    // `App.currentUser` updates to match the logged in user
    // assert(user.id === app.currentUser.id);
    return user;
  } catch (err) {
    console.error("Failed to log in", err);
  }
}

function MyApp({ Component, pageProps, session, plan, user }) {
  const router = useRouter();
  const link = new HttpLink({
    uri: GRAPHQL_URL,
    fetch: async (uri, options) => {
      //passed accessToken from auth0
      const accessToken = (await loginCustomJwt(session.idToken)).accessToken;
      options.headers.Authorization = `Bearer ${accessToken}`;
      return fetch(uri, options);
    },
  });

  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache({
      addTypename: false,
    }),
  });
  /* CD (EV on 20210220): check if client side*/
  if (process.browser) {
    /* CD (EV on 20210220): check if use is logged in*/
    if (!!pageProps?.session && !!pageProps?.session?.user) {
      if (!!pageProps.session.user[`${window.location.origin}/role`]) {
        if (
          !pageProps.session.user[`${window.location.origin}/role`]?.includes(
            "Admin"
          ) &&
          router.pathname.includes("admin")
        ) {
          router.push("/dashboard");
        }
      }
      if (plan?.plan === null) {
        /* CD (EV on 20210220): redirect to plans*/
        router.push("/plans");
        return (
          /* CD (EV on 20210220): show redireting html*/
          <div>
            <p>Redirecting... no plan</p>
          </div>
        );
      }
    } else {
      /* CD (EV on 20210220): check if user is in /dashboard */
      if (router.pathname.includes("dashboard")) {
        router.push("/api/auth/login");
      }
    }
  }

  return (
    <UserProvider>
      <I18nextProvider i18n={i18next}>
        <TranslationWrapper>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </TranslationWrapper>
      </I18nextProvider>
    </UserProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const req = appContext.ctx.req;
  const appProps = await App.getInitialProps(appContext);
  //get session from auth0
  const session = await getSession(appContext.ctx.req, appContext.ctx.res)
  var plan = null;
  var user = null
  if(session){
    async function loginCustomJwt(jwt) {
      // Create a Custom JWT credential
      const credentials = await Realm.Credentials.jwt(jwt);
      try {
        // Authenticate the user
        const user = await app.logIn(credentials);
        // `App.currentUser` updates to match the logged in user
        // assert(user.id === app.currentUser.id);
        return user;
      } catch (err) {

        console.error("Failed to log in", err);
      }
    }
    user = await loginCustomJwt(session.idToken);
    const keys = await user?.apiKeys?.fetchAll();

    const userResponse = await apolloClient.query({
      query: USER_ID_QUERY,
      variables: {
        query: {
          auth_id: session.user.sub.replace('auth0|', ''),
        },
      },
    });

    if(userResponse.data.user === null){
      //create user if not existing 
      const res = await apolloClient.query({
        query: USER_INSERT_ONE_MUTATION,
        variables: {
          data: {
            email: session.user.email,
            stripe_customer_id:"",
            auth_id: session.user.sub.replace('auth0|', '')
          }
        },
      });

      const res2 = await apolloClient.query({
        query: APP_INSERT_ONE_MUTATION,
        variables: {
          input: {
            app_url: session.user.sub.replace('auth0|', ''),
            map_api_key: "",
            created_by_id: session.user.sub.replace('auth0|', ''),
            font_color_1: process.env.MAPBOX_FONT_COLOR_1,
            heading_background_color: process.env.MAPBOX_HEADING_BACKGROUND_COLOR,
            map_center: [process.env.MAPBOX_LAT, process.env.MAPBOX_LNG],
            map_height: process.env.MAPBOX_HEIGHT,
            map_zoom: process.env.MAPBOX_ZOOM,
            map_style: process.env.MAPBOX_STYLE.replace('mapbox://styles/mapbox/', ''),
          }
        },
      });
    }

    if (keys?.length === 0) {
      const key = await user.apiKeys.create("mapbox");
      await apolloClient.query({
        query: USER_UPDATE_ONE_MUTATION,
        variables: {
          query: {
            _id: user.id,
          },
          set: {
            realm_api_key: key.key, 
          },
        },
      });
    }

    const res = await fetch(process.env.NEXTAUTH_URL + "/api/stripe/me", {
      method: "POST",
      body: JSON.stringify({
        session: session,
      }),
    });


    plan = await res.json();
  }


  return { ...appProps, session: session, user: user, plan: plan };
};

export default MyApp;
