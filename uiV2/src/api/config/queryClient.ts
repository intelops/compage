import { QueryClient, QueryObserverOptions } from "@tanstack/react-query";

const defaultQueryConfig: QueryObserverOptions = {
  staleTime: 60000,
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: defaultQueryConfig,
  },
});
