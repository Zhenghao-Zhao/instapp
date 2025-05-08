import { delay } from "@/app/_libs/utils";
import { Post } from "@/app/_libs/vars/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { clientApi } from "../axios";

export default function useDeletePost() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: deletePost,
    onMutate: async (postId) => {
      queryClient.cancelQueries({ queryKey: ["posts"] });
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: any) => {
        if ("pages" in old) {
          const newPages = old.pages.map((page: any) => {
            const newData = page.data.filter((post: Post) => {
              return post.postId !== postId;
            });
            return { ...page, data: newData };
          });
          return { ...old, pages: newPages };
        } else if (Array.isArray(old)) {
          return old.filter((post: Post) => post.postId !== postId);
        } else {
          return old;
        }
      });
      // close modal after delete
      router.back();
    },
    onError: (err, _postId, _context) => {
      console.log(err);
      toast.error("Request failed, please try again later");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return mutation;
}

const deletePost = async (postId: string) => {
  await delay(2000);
  return clientApi.delete(`post/${postId}`);
};
