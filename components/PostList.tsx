import { getPosts } from "@/lib/actions/postActions";
import PostCard from "./PostCard";
import { IPost } from "@/models/Post";

interface PostData extends IPost {
  user: any;
}

export default async function PostList() {
  const { data: posts } = await getPosts();
  if (!posts || posts.length === 0) {
    return <div className="text-center text-zinc-400">No posts available</div>;
  }

  return (
    <div className="w-full grid gap-6 justify-center">
      {posts.map((post: PostData) => (
        <PostCard key={post?._id.toString()} post={post} />
      ))}
    </div>
  );
}
