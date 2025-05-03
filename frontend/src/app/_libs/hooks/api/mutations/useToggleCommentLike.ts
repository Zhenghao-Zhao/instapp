import { Comment, CommentPage } from "@/app/_libs/vars/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { clientApi } from "../axios";

export default function useToggleCommentLike(postId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: toggleCommentLike,
    onMutate: async ({ commentId, liked }) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      const prevData = queryClient.getQueryData<InfiniteData<CommentPage>>([
        "comments",
        postId,
      ]);

      if (prevData) {
        const newPages = prevData.pages.map((page) => {
          const newComments = page.data.map((comment) => {
            if (comment.commentId == commentId) {
              const update: Partial<Comment> = {
                hasLiked: liked,
                likeCount: liked
                  ? comment.likeCount + 1
                  : comment.likeCount - 1,
              };
              return { ...comment, ...update };
            }
            return comment;
          });
          return { ...page, data: newComments };
        });
        const newData = { ...prevData, pages: newPages };
        queryClient.setQueryData(["comments", postId], newData);
      }
      return { prevData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
    onError: (error, _variables, context) => {
      console.log(error);
      toast.error("Request failed, please try again later");
      if (!context) return;
      queryClient.setQueryData(["comments", postId], context.prevData);
    },
  });
  return mutation;
}

const toggleCommentLike = ({
  commentId,
  liked,
}: {
  commentId: string;
  liked: boolean;
}) => {
  return liked
    ? clientApi.post(`comment/${commentId}/like`)
    : clientApi.post(`comment/${commentId}/unlike`);
};
