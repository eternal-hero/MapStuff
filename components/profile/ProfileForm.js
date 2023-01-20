import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { USER_UPDATE_ONE_MUTATION } from "../../graphql/profile/user.mutation";
import { USER_QUERY } from "../../graphql/profile/user.query";
import AppNotification from "../global/AppNotification";

const ProfileForm = ({ session }) => {
  const { t } = useTranslation();
  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: {
      query: {
        auth_id: session.user.sub.replace("auth0|", ""),
      },
    },
  });

  const [
    updateUser,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(USER_UPDATE_ONE_MUTATION);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  /* CD (JD on 20200824): App Notif on Profile Submission */
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationContent, setNotificationContent] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");

  useEffect(() => {
    if (!loading && data.user) {
      console.log(data.user);
      setEmail(data.user.email);
    }
  }, [loading, data]);

  if (!session.user) return <p>Access Denied</p>;
  return (
    <>
      <AppNotification
        isOpen={notificationOpen}
        setIsOpen={setNotificationOpen}
        content={notificationContent}
        title={notificationTitle}
      />
      <div>
        <label>{t("email")}</label>
        <div>{email}</div>
      </div>
    </>
  );
};

export default ProfileForm;
