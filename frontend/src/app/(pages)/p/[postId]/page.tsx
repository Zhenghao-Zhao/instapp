import { serverApi } from "@/app/_libs/hooks/api/axios";
import { fromError } from "@/app/_libs/utils";
import { PostSchema } from "@/app/_libs/vars/schemas";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Content from "./_content";

export default async function Page({
  params: { postId },
}: {
  params: { postId: string };
}) {
  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery({
      queryKey: ["post", postId],
      queryFn: ({ queryKey }) => {
        const [_, username] = queryKey;
        return getPost(username);
      },
      staleTime: 60 * 1000,
    });
  } catch (error) {
    const apiError = fromError(error);
    if (apiError.status === 404) {
      notFound();
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content postId={postId} />;
    </HydrationBoundary>
  );
}

const getPost = async (postId: string) => {
  const result = await serverApi.get(`post/${postId}`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return PostSchema.parse(result.data.data);
};
