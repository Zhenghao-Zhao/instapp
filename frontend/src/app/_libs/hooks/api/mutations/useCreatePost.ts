import { useModalContext } from "@/app/_libs/contexts/providers/ModalContextProivder";
import { fromError } from "@/app/_libs/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { clientApi } from "../axios";

export default function useCreatePost() {
  const queryClient = useQueryClient();
  const { setAlertOnClose } = useModalContext();
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries();
      setAlertOnClose(false);
    },
    onError: (error) => {
      const apiError = fromError(error);
      toast.error(`Something went wrong: ${apiError.message}`);
    },
  });

  return mutation;
}

const createPost = async (postForm: FormData) => {
  const resp = await clientApi.post("post/create", postForm);
  return resp.data;
};
