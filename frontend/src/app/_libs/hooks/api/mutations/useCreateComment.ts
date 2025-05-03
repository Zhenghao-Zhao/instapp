import { CommentSchema } from "@/app/_libs/vars/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { clientApi } from "../axios";

export default function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: async (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
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
  postId,
}: {
  content: string;
  postId: string;
}) => {
  const result = await clientApi.post(`post/${postId}/comment`, {
    content,
  });

  return CommentSchema.parse(result.data.data);
};
