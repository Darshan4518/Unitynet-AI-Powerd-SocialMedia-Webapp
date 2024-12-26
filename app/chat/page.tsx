import { getUserFromToken } from "@/hooks/getUserFromToken";
import { getUsers } from "@/lib/actions/userActions";
import dynamic from "next/dynamic";
import React from "react";
const Messages = dynamic(() => import("@/components/Messages"), {
  loading: () => <p>Loading...</p>,
});
const Chat = async () => {
  const { users } = await getUsers();
  const { id } = await getUserFromToken();
  return <Messages users={users} userId={id.toString() || ""} />;
};

export default Chat;
