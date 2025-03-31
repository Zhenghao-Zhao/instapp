import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { clientApi } from "../axios";
import { CommentPage, PostComment } from "@/app/_libs/types";
import { toast } from "react-toastify";

export default function useToggleCommentLike(postUid: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: toggleCommentLike,
    onMutate: async ({ commentUid, liked }) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", postUid],
      });

      const prevData = queryClient.getQueryData<InfiniteData<CommentPage>>([
        "comments",
        postUid,
      ]);

      if (prevData) {
        const newPages = prevData.pages.map((page) => {
          const newComments = page.data.map((comment) => {
            if (comment.commentUid == commentUid) {
              const update: Partial<PostComment> = {
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
        queryClient.setQueryData(["comments", postUid], newData);
        return { prevData };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postUid],
      });
    },
    onError: (error, _variables, context) => {
      console.log(error);
      toast.error("Request failed, please try again later");
      if (!context || !context.prevData) return;
      queryClient.setQueryData(["comments", postUid], context.prevData);
    },
  });
  return mutation;
}

const toggleCommentLike = ({
  commentUid,
  liked,
}: {
  commentUid: string;
  liked: boolean;
}) => {
  return liked
    ? clientApi.post(`comment/${commentUid}/like`)
    : clientApi.post(`comment/${commentUid}/unlike`);
};
