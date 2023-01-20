import { useSession, getSession } from "next-auth/client";
import ViewLocation from "../../../../../../components/dashboard/apps/ViewLocation";

export default function Index() {
  const [session, loading] = useSession();
  if (typeof window !== "undefined" && loading) return null;

  if (!session) return null

  return (
    <div className="p-4 shadow rounded bg-white">
      <ViewLocation session={session} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
