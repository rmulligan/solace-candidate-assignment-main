// src/app/head.tsx
import Script from "next/script";

/**
 * Head component for injecting global scripts and meta tags.
 * Here we inject a shim for window.ethereum to avoid runtime errors
 * from browser extensions that expect it.
 */
export default function Head() {
  return (
    <>
      <Script id="ethereum-shim" strategy="beforeInteractive">
        {`window.ethereum = window.ethereum || {};`}
      </Script>
    </>
  );
}