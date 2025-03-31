import { clientApi } from "@/app/_api/axios";
import { PostComment } from "../../types";

export function handleAddPost(formData: FormData) {
  return clientApi.post("post/create", formData);
}

export function handleToggleLike({
  post_uid,
  has_liked,
}: {
  post_uid: string;
  has_liked: boolean;
}) {
  return has_liked
    ? clientApi.post(`post/${post_uid}/like`)
    : clientApi.post(`post/${post_uid}/unlike`);
}

export function handleDeletePost(post_uid: string) {
  return clientApi.delete(`post/${post_uid}`);
}

export function handleToggleFollow({
  uid,
  to_follow,
}: {
  uid: string;
  to_follow: boolean;
}) {
  return to_follow
    ? clientApi.post(`friend/${uid}/add`)
    : clientApi.post(`friend/${uid}/remove`);
}

export function handleAddComment(post_uid: string, formData: FormData) {
  return clientApi.post<PostComment>(
    `posts/${post_uid}/comments/add`,
    formData,
  );
}

export function handleToggleLikeComment({
  comment_uid,
  to_like,
}: {
  comment_uid: string;
  to_like: boolean;
}) {
  return to_like
    ? clientApi.post(`comment/${comment_uid}/like`)
    : clientApi.post(`comment/${comment_uid}/unlike`);
}
