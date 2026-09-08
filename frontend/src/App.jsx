import { useState, useEffect } from "react";
import { AuthProvider } from "./auth/AuthContext";
import { ToastProvider } from "./components/ui";
import AppRoutes from "./routes/AppRoutes";
import InitialSiteLoader from "./components/InitialSiteLoader";

export default function App() {
  const [siteLoaded, setSiteLoaded] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

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

  return (
    <AuthProvider>
      <ToastProvider>
        {!siteLoaded && <InitialSiteLoader isFadingOut={fadingOut} />}
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
