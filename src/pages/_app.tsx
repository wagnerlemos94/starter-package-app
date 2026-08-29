import Head from "@/layout/componets/Head";
import Footer from "@/layout/componets/Footer";
import { ToastProvider } from "@/components/Toast";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import 'leaflet/dist/leaflet.css';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoginPage = !session && router.pathname !== "/login";

  useEffect(() => {
    if (status === "loading") return;
    if (session?.accessToken) localStorage.setItem('accessToken', session.accessToken);
    if (isLoginPage) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") return null;
  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginRoute = router.pathname === '/login' || router.pathname.startsWith('/login');

  return (
    <SessionProvider session={(pageProps as any).session}>
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
