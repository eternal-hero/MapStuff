import Script from "next/script";

export default function Index({ host, session }) {
  return (

    <div className="p-6">
      <div id="map-mapstuff"></div>
      <Script src="https://cdn.gangnam.club/widget/plugins.js" />
      <Script
        src="http://localhost:3000/widget/mapbox2.js"
        data-id="dev-store-locator-react"
        data-app="618eaf03034385f0c9872d53"
        data-key="9WalmkQITagYlrDSSa5ijyzkJVC75cFjOConR2N2GXAfTvzeT1viSyv5hEnOaket"
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;

  if (req) {
    let host = req.headers.host; // will give you localhost:3000

    return {
      props: { host },
    };
  }
}
