import { Fragment, type ReactNode } from "react";
import { PostHogProvider } from "@posthog/react";

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
} as const;

interface PostHogProviderProps {
  children: ReactNode;
}

export const PostHogProviderWrapper: React.FC<PostHogProviderProps> = (
  props,
) => {
  return (
    <Fragment>
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={options}
      >
        {props.children}
      </PostHogProvider>
    </Fragment>
  );
};
