import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import StoryList from "@/components/StoryList";

const PostList = dynamic(() => import("@/components/PostList"), {
  loading: () => <PostListSkeleton />,
});
const SuggestedUserBar = dynamic(
  () => import("@/components/SuggestedUserBar"),
  {
    loading: () => <SuggestedUserBarSkeleton />,
  }
);

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-black via-zinc-900 to-zinc-800 text-white flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Main Content */}
          <main className="flex-1 space-y-8">
            <Suspense fallback={<StoryListSkeleton />}>
              <StoryList />
            </Suspense>

            {/* Social Feed Section */}
            <section>
              <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-4 sm:mb-0">
                  Social Feed
                </h1>
                <div className="h-1 w-full sm:w-64 rounded bg-gradient-to-r from-purple-400/20 to-pink-600/20" />
              </div>

              {/* Post List */}
              <Suspense fallback={<PostListSkeleton />}>
                <PostList />
              </Suspense>
            </section>
          </main>

          {/* Suggested User Section */}
          <aside className="w-full lg:w-80 mt-8 lg:mt-0">
            <div className="sticky top-8">
              <Suspense fallback={<SuggestedUserBarSkeleton />}>
                <SuggestedUserBar />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StoryListSkeleton() {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="w-20 h-20 rounded-full" />
      ))}
    </div>
  );
}

function PostListSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      ))}
    </div>
  );
}

function SuggestedUserBarSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-[150px]" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
