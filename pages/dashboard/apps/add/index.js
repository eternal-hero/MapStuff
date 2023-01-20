import React, { Component } from "react";
import AddApp from "../../../../components/dashboard/apps/AddApp";

import { useSession, getSession } from "next-auth/client";

export default function Index() {
  const [session, loading] = useSession();
  if (typeof window !== "undefined" && loading) return null;

  if (!session) return null
  return (
    <>
      <div className="p-4 shadow rounded bg-white">
        <AddApp session={session} />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
