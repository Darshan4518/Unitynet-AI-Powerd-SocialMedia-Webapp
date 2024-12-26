import { getUserFromToken } from "@/hooks/getUserFromToken";
import { getStories } from "@/lib/actions/postActions";
import AddStory from "./AddStory";
import StoryItem from "./Stories";

export default async function StoryList() {
  const { data: stories } = await getStories();
  const { id } = await getUserFromToken();
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 mb-4 my-3 mx-4">
      {id && <AddStory />}
      {stories?.map((story: any) => (
        <StoryItem story={story} key={story?._id} />
      ))}
    </div>
  );
}
