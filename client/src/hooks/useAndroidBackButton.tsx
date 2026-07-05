import { useEffect } from "react";
import { App as CapApp } from "@capacitor/app";

/**
 * Wire the Android hardware back button to SPA history.
 *
 * By default Capacitor closes the app on a back-press. Instead we navigate
 * back through the router history and only exit when there is nowhere left to
 * go. On the web the `backButton` event never fires, so this is a no-op there.
 */
export function useAndroidBackButton() {
  useEffect(() => {
    const listener = CapApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        CapApp.exitApp();
      }
    });

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, []);
}
