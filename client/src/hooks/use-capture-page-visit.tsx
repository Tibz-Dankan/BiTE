import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { siteVisitAPI } from "../api/siteVisit";
import type { TPostSiteVisit } from "../types/siteVisit";

export const useCapturePageVisit = () => {
  const location = useLocation();

  const { mutate } = useMutation({
    mutationFn: siteVisitAPI.post,
    onSuccess: (response: any) => {
      console.log("Site visit captured successfully:", response);
    },
    onError: (error: any) => {
      console.error("Failed to capture site visit:", error.message);
    },
  });

  useEffect(() => {
    const captureVisit = () => {
      const visitData: TPostSiteVisit = {
        page: location.pathname,
        path: location.pathname,
        capturedAt: new Date().toISOString(),
      };

      mutate(visitData);
    };

    captureVisit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
};
