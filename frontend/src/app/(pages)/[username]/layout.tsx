import { ReactNode } from "react";

export default function Layout({
  posts,
  profile,
}: {
  posts: ReactNode;
  profile: ReactNode;
}) {
  return (
    <main className="max-w-grid-maxWidth flex flex-col grow w-full">
      {profile}
      {posts}
    </main>
  );
}
