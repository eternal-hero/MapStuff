import Plans from "../../components/global/Plans";
import { useSession, getSession, signIn, signOut } from "next-auth/client";
import TheFooter from "../../components/layouts/TheFooter";
import AppButton from "../../components/global/AppButton";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
export default function Index({ session }) {
  const { t } = useTranslation();
  const router = useRouter();

  if (process.browser) {
    const handleClick = (e) => {
      router.push("/");
    };
    if (!session) {
      handleClick();
    }
  }
  return (
    <>
      <div>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-12">
          {session && (
            <>
              <AppButton
                handleClick={signOut}
                label={t("sign_out")}
                className="tertiary"
              />

              <div className="text-center">
                <h1 className="block text-3xl font-extrabold leading-8 tracking-tight text-sky-600 sm:text-4xl lg:text-5xl">
                  {t("plans.choose_plan")}
                </h1>
                <p className="max-w-4xl mx-auto mt-5 text-xl text-gray-500 sm:text-center">
                  {t("plans.subtitle")}
                </p>
                <div className="mt-10">
                  <Plans session={session} isFromRegistration={true} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const res = await fetch(process.env.NEXTAUTH_URL + "/api/stripe/me", {
    method: "POST",
    body: JSON.stringify({
      session: session,
    }),
  });

  if (session) {
    const plan = await res.json();
    session.user.plan = plan.plan;
  }

  return {
    props: { session },
  };
}
