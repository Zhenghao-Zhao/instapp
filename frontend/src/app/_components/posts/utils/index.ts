import { Post, UserComment } from "@/app/_libs/types";
import { QueryClient } from "@tanstack/react-query";

export async function optDeletePost(
  queryClient: QueryClient,
  post_uid: string
) {
  await queryClient.cancelQueries({ queryKey: ["posts"] });

  queryClient.setQueriesData(
    { queryKey: ["posts"], type: "active" },
    (data: any) => {
      // check if query cache is pointing to paginated data
      if ("pages" in data) {
        const newPages = data.pages.map((page: any) => {
          const newPosts = page.posts.filter(
            (post: Post) => post.uid !== post_uid
          );
          return { ...page, posts: newPosts };
        });
        return { ...data, pages: newPages };
      } else if (data.uid === post_uid) {
        return data.filter((post: Post) => post.uid !== post_uid);
      }
    }
  );
  const prevData = queryClient.getQueriesData({ queryKey: ["posts"] });
  return { prevData };
}

export async function optAddComment(
  queryClient: QueryClient,
  comment: UserComment,
  queryKey: string
) {
  const prevData: any = queryClient.getQueryData(["comments", queryKey]);
  if (!prevData) {
    window.location.reload();
    return;
  }
  // add new comment to first page
  const firstPage = prevData.pages[0];
  const newPage = {
    ...firstPage,
    comments: [comment, ...firstPage.comments],
  };
  const newPages = prevData.pages.map((page: any, i: number) => {
    return i === 0 ? newPage : page;
  });
  const newData = { ...prevData, pages: newPages };
  queryClient.setQueryData(["comments", queryKey], newData);
}

export async function optUpdatePaginatedList<T>(
  listName: string,
  queryClient: QueryClient,
  update: Partial<T>,
  queryKey: string,
  pageNum: number,
  index: number
) {
  await queryClient.cancelQueries({ queryKey: [listName, queryKey] });
  const prevData: any = queryClient.getQueryData([listName, queryKey]);
  if (!prevData) {
    window.location.reload();
    return;
  }
  const newPages = prevData.pages.map((prevPage: any, i: number) => {
    if (i !== pageNum) return prevPage;
    const newItems = prevPage[listName].map((prevItem: T, i: number) => {
      if (i === index) {
        return {
          ...prevItem,
          ...update,
        };
      }
      return prevItem;
    });
    return { ...prevPage, [listName]: newItems };
  });
  const newData = { ...prevData, pages: newPages };
  queryClient.setQueryData([listName, queryKey], newData);
  return { prevData, newData };
}

export async function batchUpdatePosts(
  queryClient: QueryClient,
  update: Partial<Post>,
  post_uid: string
) {
  await queryClient.cancelQueries({ queryKey: ["posts"] });

  queryClient.setQueriesData(
    { queryKey: ["posts"], type: "active" },
    (data: any) => {
      // check if query cache is pointing to paginated data
      if ("pages" in data) {
        const newPages = data.pages.map((page: any) => {
          const newPosts = page.posts.map((post: Post) =>
            post.uid === post_uid ? { ...post, ...update } : post
          );
          return { ...page, posts: newPosts };
        });
        return { ...data, pages: newPages };
      } else if (data.uid === post_uid) {
        return { ...data, ...update };
      }
    }
  );
  const prevData = queryClient.getQueriesData({ queryKey: ["posts"] });
  return { prevData };
}
