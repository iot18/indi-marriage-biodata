import "@styles/globals.css";
// core styles are required for all packages
import "@mantine/core/styles.css";
import Script from "next/script";

// other css files are required only if
// you are using components from the corresponding package
import "@mantine/dates/styles.css";
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';
// ...
function Application({ Component, pageProps }) {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-HKNDMP39FQ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

           gtag('config', 'G-HKNDMP39FQ');
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}

export default Application;
