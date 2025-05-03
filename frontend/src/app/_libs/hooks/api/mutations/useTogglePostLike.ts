import { Post } from "@/app/_libs/vars/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "../axios";

export default function useTogglePostLike() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: togglePostLike,
    onMutate: async ({ liked, postId }) => {
      await queryClient.cancelQueries({
        queryKey: ["posts"],
      });

      const prevPosts = queryClient.getQueriesData({ queryKey: ["posts"] });
      queryClient.setQueriesData(
        { queryKey: ["posts"], type: "active" },
        (data: any) => {
          // check if query cache is pointing to paginated data
          if ("pages" in data) {
            const newPages = data.pages.map((page: any) => {
              const newPosts = page.data.map((post: Post) => {
                if (post.postId === postId) {
                  const update: Partial<Post> = {
                    hasLiked: liked,
                    likeCount: liked ? post.likeCount + 1 : post.likeCount - 1,
                  };
                  return { ...post, ...update };
                }
                return post;
              });
              return { ...page, data: newPosts };
            });
            return { ...data, pages: newPages };
          } else if (data.postId === postId) {
            const update: Partial<Post> = {
              hasLiked: liked,
              likeCount: liked ? data.likeCount + 1 : data.likeCount - 1,
            };
            return { ...data, ...update };
          }
        },
      );
      return { prevPosts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
    onError: (error, _variables, context) => {
      console.log(error);
      if (!context) return;
      queryClient.setQueriesData({ queryKey: ["posts"] }, context.prevPosts);
    },
  });

  return mutation;
}

const togglePostLike = ({
  liked,
  postId,
}: {
  liked: boolean;
  postId: string;
}) => {
  return liked
    ? clientApi.post(`post/${postId}/like`)
    : clientApi.post(`post/${postId}/unlike`);
};
