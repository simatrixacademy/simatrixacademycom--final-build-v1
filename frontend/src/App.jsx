import { useState, useEffect } from "react";
import { AuthProvider } from "./auth/AuthContext";
import { ToastProvider } from "./components/ui";
import AppRoutes from "./routes/AppRoutes";
import InitialSiteLoader from "./components/InitialSiteLoader";
import { setIpBannedListener } from "./api/client";

export default function App() {
  const [siteLoaded, setSiteLoaded] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [bannedInfo, setBannedInfo] = useState(null);

  useEffect(() => {
    setIpBannedListener((info) => {
      setBannedInfo(info);
    });
  }, []);

  useEffect(() => {
    // Minimum 3 seconds loader display
    const minTimer = new Promise((resolve) => setTimeout(resolve, 3000));

    // Ensure initial DOM/window load has completed
    const readyPromise = new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", resolve, { once: true });
      }
    });

    Promise.all([minTimer, readyPromise]).then(() => {
      setFadingOut(true);
      setTimeout(() => {
        setSiteLoaded(true);
      }, 500);
    });
  }, []);

  if (bannedInfo) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0f172a] text-white p-6">
        <div className="text-center max-w-md">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-rose-500 font-display tracking-tight">
            You are banned
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {bannedInfo.message === "You are banned"
              ? "Your IP address has been blocked from accessing this system."
              : bannedInfo.message || "Your IP address has been blocked from accessing this system."}
          </p>
          {bannedInfo.ip && (
            <div className="mt-4 inline-block rounded-lg bg-slate-800/80 px-3 py-1 font-mono text-xs text-slate-400 border border-slate-700/50">
              IP: {bannedInfo.ip}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ToastProvider>
        {!siteLoaded && <InitialSiteLoader isFadingOut={fadingOut} />}
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
