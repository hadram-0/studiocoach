"use client";

import { useState, useEffect, useRef } from "react";
import type { Team, TeamMember, Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { mockUser } from "@/lib/data";
import { getChatMessages, onNewMessage, sendMessage } from "@/lib/data";
import { Avatar, AvatarFallback } from "./ui/avatar";


export default function ChatClient({ team, members }: { team: Team, members: TeamMember[] }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentUser = mockUser;

    useEffect(() => {
        // Initial fetch of messages
        getChatMessages(team.id).then(initialMessages => {
            setMessages(initialMessages);
        });

        // Subscribe to new messages
        const unsubscribe = onNewMessage(team.id, (newMessage) => {
            setMessages(prevMessages => [...prevMessages, newMessage]);
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();

    }, [team.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;

        sendMessage(team.id, newMessage);
        setNewMessage("");
    };
    
    const getMemberForMessage = (message: Message) => {
        if (message.senderId === currentUser.id) return currentUser;
        return members.find(m => m.id === message.senderId);
    }

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 flex items-center bg-card border-b sticky top-0 z-10">
                <Button asChild variant="ghost" size="icon" className="-ml-2 mr-2">
                    <Link href="/team" aria-label="Retour à la liste des équipes">
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </Link>
                </Button>
                <h2 className="text-xl font-bold text-gray-800 truncate">{team.name}</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                     const member = getMemberForMessage(message);
                     const isSent = message.senderId === currentUser.id;
                     const initials = member?.displayName.substring(0, 2).toUpperCase() || '??';
                     return (
                        <div key={message.id} className={`flex items-end gap-2 ${isSent ? 'justify-end' : ''}`}>
                             {!isSent && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                             )}
                            <div className={`max-w-[75%] rounded-lg px-3 py-2 ${isSent ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                {!isSent && <p className="text-xs font-bold text-destructive mb-1">{member?.displayName}</p>}
                                <p className="text-sm">{message.text}</p>
                                <p className="text-xs text-right mt-1 opacity-70">{new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit'})}</p>
                            </div>
                        </div>
                     )
                })}
                 <div ref={messagesEndRef} />
            </div>

            <footer className="p-2 border-t bg-card sticky bottom-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Votre message..."
                        className="flex-1"
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-5 w-5" />
                        <span className="sr-only">Envoyer</span>
                    </Button>
                </form>
            </footer>
        </div>
    );
}
