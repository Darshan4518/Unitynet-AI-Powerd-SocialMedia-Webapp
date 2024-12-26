import React, { Suspense } from "react";
import { getPosts } from "@/lib/actions/postActions";
import PostDetails from "@/components/PostDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";

const Explore = async () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-4 sm:mb-0">
              Explore
            </h1>
            <div className="h-1 w-full sm:w-64 rounded bg-gradient-to-r from-purple-400/20 to-pink-600/20" />
          </div>
        </header>

        <ErrorBoundary fallback={<ErrorMessage />}>
          <Suspense fallback={<PostGridSkeleton />}>
            <PostGrid />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

const PostGrid = async () => {
  const { data: posts } = await getPosts();

  if (!posts) {
    throw new Error("Failed to fetch posts");
  }

  if (!posts || posts.length === 0) {
    return <p className="text-center text-gray-400">No posts found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {posts.map((post) => (
        <PostDetails key={post._id.toString()} post={post} />
      ))}
    </div>
  );
};

const PostGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(8)].map((_, index) => (
      <Skeleton key={index} className="w-full aspect-square rounded-lg" />
    ))}
  </div>
);

const ErrorMessage = () => (
  <div className="text-center text-red-500">
    <p>Oops! Something went wrong while fetching posts.</p>
    <p>Please try again later.</p>
  </div>
);

export default Explore;
