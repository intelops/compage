import { useMutation } from "@tanstack/react-query";
import { getCode } from "./resolvers";

interface GetCodeParams {
  projectId: string;
}

const useGetCode = (params: GetCodeParams) => {
  return useMutation(
    () => getCode(params.projectId),
    {
      onMutate(_variables) {
        // Do something here
        // e.g. dispatch an action to update the state
      },
    },
  );
};

export const useCodeActions = {
  useGetCode,
};
