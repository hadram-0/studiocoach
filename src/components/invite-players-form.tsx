"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { TeamWithMembers } from "@/lib/types";
import { Card } from "./ui/card";

const inviteSchema = z.object({
  invitedPlayers: z.array(z.string()).min(1, "Vous devez inviter au moins un joueur."),
});

export default function InvitePlayersForm({ teams, eventId }: { teams: TeamWithMembers[], eventId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      invitedPlayers: [],
    },
  });

  async function onSubmit(values: z.infer<typeof inviteSchema>) {
    setLoading(true);
    // Mock sending invitations
    console.log(`Sending ${values.invitedPlayers.length} invitations for event ${eventId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Invitations envoyées !",
      description: "Les joueurs sélectionnés ont été notifiés.",
    });
    router.push("/dashboard");
    setLoading(false);
  }

  return (
    <Card className="p-4">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="invitedPlayers"
            render={() => (
                <FormItem>
                <div className="mb-4">
                    <FormLabel className="text-base">Convoquer les joueurs</FormLabel>
                    <FormDescription>
                    Sélectionnez les joueurs à convoquer pour cet événement.
                    </FormDescription>
                </div>
                <Accordion type="multiple" className="w-full">
                    {teams.map((team) => (
                    <AccordionItem key={team.id} value={team.id}>
                        <AccordionTrigger className="font-semibold">{team.name}</AccordionTrigger>
                        <AccordionContent>
                        <div className="space-y-2">
                        {team.members.map((item) => (
                            <FormField
                            key={item.id}
                            control={form.control}
                            name="invitedPlayers"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...field.value, item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.id
                                                )
                                            )
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    {item.displayName}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                            />
                        ))}
                        </div>
                        </AccordionContent>
                    </AccordionItem>
                    ))}
                </Accordion>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <Button type="submit" variant="destructive" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...</> : "Envoyer les invitations"}
            </Button>
        </form>
        </Form>
    </Card>
  );
}
