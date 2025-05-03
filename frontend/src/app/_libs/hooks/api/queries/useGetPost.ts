import { fromError } from "@/app/_libs/utils";
import { PostSchema } from "@/app/_libs/vars/schemas";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { clientApi } from "../axios";

export default function useGetPost(postId: string) {
  const query = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPost(postId),
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (query.error) {
    const apiError = fromError(query.error);
    if (apiError.status === 404) {
      notFound();
    }
    throw Error(apiError.message);
  }
  return query;
}

const getPost = async (postId: string) => {
  const result = await clientApi.get(`post/${postId}`);
  return PostSchema.parse(result.data.data);
};
