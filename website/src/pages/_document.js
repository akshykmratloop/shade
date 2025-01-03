import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html dir="rtl" lang="ar">
      <Head />
      <body>
        <Main />
        <div id="modal-root"></div> {/* Modal root for React Portal */}
        <NextScript />
      </body>
    </Html>
  );
}
