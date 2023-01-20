import Head from "next/head";

import DashboardLayout from "../../../../components/layouts/dashboard/DashboardLayout";
import PaymentCanceled from "../../../../components/dashboard/plans/PaymentCanceled";

function Index({ host }) {
  return (
    <div>
      <DashboardLayout >
        <Head>
          <title>Plans</title>
          <meta property="og:title" content="MapStuff.io" key="title" />
        </Head>
        <PaymentCanceled />
      </DashboardLayout>
    </div>
  );
}

export default Index;
