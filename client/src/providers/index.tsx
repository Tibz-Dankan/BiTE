import type { ReactNode } from "react";
import React from "react";
import { ReactQueryProvider } from "./ReactQuery";
import { PostHogProviderWrapper } from "./PostHogProvider";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = (props) => {
  return (
    <PostHogProviderWrapper>
      <ReactQueryProvider>{props.children}</ReactQueryProvider>
    </PostHogProviderWrapper>
  );
};
