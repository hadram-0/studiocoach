"use client";

import { useState, useEffect, useRef } from "react";
import type { Team, TeamMember, Message, User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Sparkles, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, getChatMessages, onNewMessage, sendMessage } from "@/lib/data";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { generateTeamComposition, GenerateTeamCompositionInput } from "@/ai/flows/team-composition-generator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";


export default function ChatClient({ team, members }: { team: Team, members: TeamMember[] }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getCurrentUser().then(setCurrentUser);

        getChatMessages(team.id).then(initialMessages => {
            setMessages(initialMessages);
        });

        const unsubscribe = onNewMessage(team.id, (newMessage) => {
            setMessages(prevMessages => [...prevMessages, newMessage]);
        });

        return () => unsubscribe();

    }, [team.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !currentUser) return;

        sendMessage(team.id, newMessage);
        setNewMessage("");
    };
    
    const getMemberForMessage = (message: Message) => {
        if (message.senderId === currentUser?.id) return currentUser;
        return members.find(m => m.id === message.senderId);
    }
    
    if (!currentUser) {
        return <div className="flex items-center justify-center h-full">Chargement...</div>;
    }

    const isCoach = currentUser.role === 'coach' || currentUser.role === 'admin';

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 flex items-center bg-card border-b sticky top-0 z-10">
                <Button asChild variant="ghost" size="icon" className="-ml-2 mr-2">
                    <Link href="/team" aria-label="Retour à la liste des équipes">
                        <ArrowLeft className="h-6 w-6 text-foreground" />
                    </Link>
                </Button>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold truncate">{team.name}</h2>
                </div>
                {isCoach && (
                    <CompositionGeneratorDialog members={members} />
                )}
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


function CompositionGeneratorDialog({ members }: { members: TeamMember[] }) {
    const [open, setOpen] = useState(false);
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [formationDescription, setFormationDescription] = useState("");
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handlePlayerToggle = (playerId: string) => {
        setSelectedPlayers(prev => 
            prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneratedImage(null);

        const playerNames = selectedPlayers.map(id => members.find(m => m.id === id)?.displayName).filter(Boolean) as string[];

        const input: GenerateTeamCompositionInput = {
            playerList: playerNames.join(", "),
            formationDescription: formationDescription,
        };

        try {
            const result = await generateTeamComposition(input);
            setGeneratedImage(result.imageUrl);
        } catch (error) {
            console.error("Failed to generate composition:", error);
            toast({
                variant: "destructive",
                title: "Erreur de génération",
                description: "L'image de la composition n'a pas pu être créée.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Composition
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Générer une Composition d'Équipe</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="font-semibold">1. Sélectionner les joueurs</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto p-1 border rounded-md">
                            {members.map(member => (
                                <div key={member.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`player-${member.id}`}
                                        checked={selectedPlayers.includes(member.id)}
                                        onCheckedChange={() => handlePlayerToggle(member.id)}
                                    />
                                    <Label htmlFor={`player-${member.id}`} className="text-sm font-normal">
                                        {member.displayName}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="formation-desc" className="font-semibold">2. Décrire la formation</Label>
                        <Textarea
                            id="formation-desc"
                            value={formationDescription}
                            onChange={(e) => setFormationDescription(e.target.value)}
                            placeholder="Ex: 4-4-2 avec Martin et Petit en attaque, Durand sur l'aile droite..."
                            className="mt-1"
                        />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading || selectedPlayers.length === 0 || !formationDescription}>
                        {isLoading ? "Génération..." : <><Sparkles className="mr-2 h-4 w-4"/>Générer l'image</>}
                    </Button>
                </form>

                {generatedImage && (
                    <div className="mt-4 border-t pt-4">
                        <h3 className="font-semibold mb-2">Composition générée</h3>
                        <div className="relative w-full aspect-video rounded-md overflow-hidden bg-gray-200">
                             <Image src={generatedImage} alt="Composition d'équipe générée" layout="fill" objectFit="contain" />
                        </div>
                        <Button variant="outline" className="w-full mt-2" onClick={() => console.log("Share this image")}>
                           Partager dans le chat (à implémenter)
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}