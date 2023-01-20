/* CD (EV on 20210212): Import useState */
import { useState } from "react";
/* CD (EV on 20210212): Import signIn next/auth https://next-auth.js.org/getting-started/example#add-react-hook */
import { signIn } from "next-auth/client";
/* CD (EV on 20210212): Import AppForm*/
import AppForm from "../global/AppForm";
/* CD (EV on 20210212): Import AppButton*/
import AppButton from "../global/AppButton";
export default function App() {
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
      /* CD (JD on 20210827): Add keyboard enter handler */
      handleOnKeyDown: (event) => {
        if(event.key === 'Enter'){
          submit()
        }
      }
    },
    {
      type: "password",
      label: "Password",
      value: password,
      handleInput: (event) => setPassword(event.target.value),
      /* CD (JD on 20210827): Add keyboard enter handler */
      handleOnKeyDown: (event) => {
        if(event.key === 'Enter'){
          submit()
        }
      }
    },
  ];

  /* CD (EV on 20210212): when login button click*/

  const submit = () => {

    signIn(
      "credentials",
      {
        email,
        password,
        // The page where you want to redirect to after a
        // successful login
        callbackUrl: `${window.location.origin}/dashboard`,
      },
    
    );
  };

  return (
    <form action="#" method="POST">
      <AppForm formInput={FormInput} />
      <AppButton
        className="primary-full"
        label="Sign in"
        handleClick={submit}
      />
    </form>
  );
}
