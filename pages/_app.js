import "@styles/globals.css";
// core styles are required for all packages
import "@mantine/core/styles.css";
import Script from "next/script";
import Head from "next/head";
// other css files are required only if
// you are using components from the corresponding package
import "@mantine/dates/styles.css";
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';
// ...
function Application({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Indian Biodata Maker - Create Your Biodata PDF</title>
        <meta
          name="google-site-verification"
          content="yDhoOvTZGPTnGdTsjGqGYh8uhwLwxK6l3t_WVgkgDhM"
        />
        <meta
          name="description"
          content="100% Free, Private & Offline Biodata Generator. Securely create and download your biodata PDF in seconds with complete privacy."
        />
      </Head>

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
