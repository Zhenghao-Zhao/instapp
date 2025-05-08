"use client";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { toast } from "react-toastify";
import { fromError } from "../_libs/utils";
import GuidebarContextProvider from "./providers/GuidebarContextProvider";
import ScrollContextProvider from "./providers/ScrollContextProvider";

function makeQueryClient() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        const apiError = fromError(error);
        toast.error(`Something went wrong: ${apiError.message}`);
      },
    }),
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        // staleTime: 60 * 1000,
      },
    },
  });

  return queryClient;
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollContextProvider>
        <GuidebarContextProvider>{children}</GuidebarContextProvider>
      </ScrollContextProvider>
    </QueryClientProvider>
  );
}
