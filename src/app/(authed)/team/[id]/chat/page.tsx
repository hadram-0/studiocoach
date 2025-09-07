import ChatClient from "@/components/chat-client";
import { getTeamById, getTeamMembers } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function ChatPage({ params }: { params: { id: string } }) {
    const team = await getTeamById(params.id);

    if (!team) {
        notFound();
    }

    const members = await getTeamMembers(team.id);

    return <ChatClient team={team} members={members} />;
}
