import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import Script from 'next/script';

const FrontendLayout = ({ children }) => {
    return (
        <>
            {/* Start GTM code */}
            <Script dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','{process.env.GTM}');`}} />

            <noscript dangerouslySetInnerHTML={{
                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.GTM}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`}}></noscript>
            {/* End GTM code */}
            <div>
                <div className="sticky top-0 z-50">
                    <TheHeader />
                </div>
                <main>{children}</main>
                <TheFooter />
            </div>
        </>
    )
}

export default FrontendLayout;