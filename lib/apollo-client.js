import * as Realm from "realm-web";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import fetch from "isomorphic-unfetch";

const app = Realm.App.getApp(process.env.REALM_APP_ID);
const graphql_url = `https://realm.mongodb.com/api/client/v2.0/app/${process.env.REALM_APP_ID}/graphql`;

async function loginApiKey(apiKey) {
  // Create an API Key credential
  const credentials = Realm.Credentials.apiKey(apiKey);
  try {
    // Authenticate the user
    const user = await app.logIn(credentials);
    // `App.currentUser` updates to match the logged in user
    return user;
  } catch (err) {
    console.error("Failed to log in", err);
  }
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: graphql_url,
    fetch: async (uri, options) => {
      const accessToken = (await loginApiKey(process.env.REALM_APP_KEY))
        .accessToken;
      options.headers.Authorization = `Bearer ${accessToken}`;
      return fetch(uri, options);
    },
  }),
  schemaVersion: 2,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export default client;
