import { getUserFromToken } from "@/hooks/getUserFromToken";
import { getProfile } from "@/lib/actions/userActions";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const ProfileEditForm = dynamic(() => import("@/components/ProfileEditForm"), {
  loading: () => (
    <div className="">
      <Loader2 className=" animate-ping size-5 m-30" />
    </div>
  ),
});

export default async function EditProfile() {
  const { id } = await getUserFromToken();
  const { user } = await getProfile(id);

  return <ProfileEditForm user={user} />;
}
