/* CD (EV on 20210212): Import useState */
import { useState } from "react";
/* CD (EV on 20210212): Import signIn next/auth https://next-auth.js.org/getting-started/example#add-react-hook */
import { signIn } from "next-auth/client";
/* CD (EV on 20210212): Import useMutation apollo/client https://www.apollographql.com/docs/react/data/mutations/*/
import { useMutation } from "@apollo/client";
/* CD (EV on 20210212): Import USER_INSERT_ONE_MUTATION grapql */
import { USER_INSERT_ONE_MUTATION } from "../../graphql/registration/user.mutation";
/* CD (EV on 20210212): Import APP_INSERT_ONE_MUTATION grapql */
import { APP_INSERT_ONE_MUTATION } from "../../graphql/registration/app.mutation";
/* CD (EV on 20210212): Import bcrypt https://www.npmjs.com/package/bcryptjs */
import bcrypt from "bcryptjs";
/* CD (EV on 20210212): Import client using API key for authentication*/
import client from "../../lib/apollo-client";
/* CD (EV on 20210212): Import AppForm*/
import AppForm from "../global/AppForm";
/* CD (EV on 20210212): Import AppButton*/
import AppButton from "../global/AppButton";

function App() {
  /* CD (EV on 20210212): register function create app if success*/
  const [register, { loading, error }] = useMutation(USER_INSERT_ONE_MUTATION, {
    /* CD (EV on 20210212): declare apollo client*/
    client: client,
    onCompleted(data) {
      /* CD (EV on 20210212): if success registration, create app*/
      if (data) {
    
        var input = {
          app_url: data.insertOneUser._id,
          map_api_key: "",
          created_by_id: data.insertOneUser._id,
          font_color_1: process.env.MAPBOX_FONT_COLOR_1,
          heading_background_color: process.env.MAPBOX_HEADING_BACKGROUND_COLOR,
          map_center: [process.env.MAPBOX_LAT, process.env.MAPBOX_LNG],
          map_height: process.env.MAPBOX_HEIGHT,
          map_zoom: process.env.MAPBOX_ZOOM,
          map_style: process.env.MAPBOX_STYLE.replace('mapbox://styles/mapbox/', ''),
        };

        createApp({ variables: { input: input } });
      }
    },
  });

  /* CD (EV on 20210212): create app function will call after success registration*/
  const [createApp, { loadingCreateApp, errorCreateApp }] = useMutation(
    APP_INSERT_ONE_MUTATION,
    {
      /* CD (EV on 20210212): declare apollo client*/
      client: client,
      onCompleted(data) {
        /* CD (EV on 20210212): if success creating app, auto signin*/
        if (data) {
          signIn("credentials", {
            email: email,
            password: password,
            callbackUrl: `${window.location.origin}/plans`,
          });
        }
      },
    }
  );

  /* CD (EV on 20210212): email and password field handler*/
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /* CD (EV on 20210212): form fields declaration*/
  const FormInput = [
    {
      type: "text",
      label: "Email",
      value: email,
      handleInput: (event) => setEmail(event.target.value),
    },
    {
      type: "password",
      label: "Password",
      value: password,
      handleInput: (event) => setPassword(event.target.value),
    },
  ];
  /* CD (EV on 20210212): when register button click*/
  const submit = async (e) => {
    e.preventDefault();

    var data = {
      email: email,
      /* CD (EV on 20210212): hash the password*/
      password: bcrypt.hashSync(password, 10),
      role_id:2,
      stripe_customer_id:""
    };
    register({
      variables: { data: data },
    });
  };

  return (
    <form action="#" method="POST">
      <AppForm formInput={FormInput} />
      <AppButton
        className="primary-full"
        label="Sign up"
        handleClick={submit}
      />
    </form>
  );
}

export default App;
