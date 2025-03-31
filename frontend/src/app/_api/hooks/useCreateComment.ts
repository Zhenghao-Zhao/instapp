import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "../axios";
import { commentSchema } from "@/app/_libs/types";
import { toast } from "react-toastify";

export default function useCreateComment(postUid: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postUid],
      });
    },
    onError: (err) => {
      toast.error("Request failed, please try again later");
      console.log(err);
    },
  });

  return mutation;
}

const createComment = async ({
  content,
  postUid,
}: {
  content: string;
  postUid: string;
}) => {
  const result = await clientApi.post(`post/${postUid}/comment`, {
    content,
    postUid,
  });

  return commentSchema.parse(result.data.payload);
};
