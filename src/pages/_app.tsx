import Head from "@/layout/components/Head";
import Footer from "@/layout/components/Footer";
import { ToastProvider } from "@/components/Toast";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import 'leaflet/dist/leaflet.css';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  const shouldRedirect = status === "unauthenticated" && router.pathname !== "/login";

  useEffect(() => {
    if (status === "loading") return;
    if (shouldRedirect) {
      void router.replace("/login");
    }
  }, [router, shouldRedirect, status]);

  if (status === "loading" || shouldRedirect) return null;
  return <>{children}</>;
}

type PageProps = { session?: Session };

export default function App({ Component, pageProps }: AppProps<PageProps>) {
  const router = useRouter();
  const isLoginRoute = router.pathname === '/login' || router.pathname.startsWith('/login');

  return (
    <SessionProvider session={pageProps.session}>
      <ToastProvider>
        {!isLoginRoute && <Head />}
        <AuthGate>
          <Component {...pageProps} />
        </AuthGate>
        {!isLoginRoute && <Footer />}
      </ToastProvider>
    </SessionProvider>
  );
}
