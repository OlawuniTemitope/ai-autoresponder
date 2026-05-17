"use client"

import { Dialog, DialogContent, DialogDescription,
     DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import z from "zod";

import { Form,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
 FormControl,
 FormDescription
 }
 from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

 
const formSchema = z.object({
    variableName: z.string().min(1,{message: "Variable bame is required"}).regex(/^[A-Za-z0-9_$]*$/, {
        message: "variable name must start with a letter or underscore and contain only latters, numbers, and underscores"
    }),
    username: z.string().optional(),
    content: z.string().min(1, "Message content is required")
    .max(2000, "Discord message cannot exceed 2000 characters"),
    webhookUrl: z.string().min(1, "Message content is required")
})

export type DiscordFormValues = z.infer<typeof formSchema>;
interface DiscordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void; 
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?:Partial<DiscordFormValues>
}
export const DiscordDialog = (
    { 
        open,
         onOpenChange,
         onSubmit,
          defaultValues = {},
         }: DiscordDialogProps
) => {

    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            username: defaultValues.username || "",
            content: defaultValues.content || "",
            webhookUrl: defaultValues.webhookUrl || ""    
        },
    })

    useEffect(() => {
        if(open) {
            form.reset({
                variableName: defaultValues.variableName || "",
            username: defaultValues.username || "",
            content: defaultValues.content || "",
            webhookUrl: defaultValues.webhookUrl || ""    

        })
    }},[open, defaultValues, form])

    const watchVariableName = form.watch("variableName") || "myDiscord"

    
    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
        onOpenChange(false)
    }
  return(
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Discord Configuration</DialogTitle>
                <DialogDescription>
                    Configure the Discord webhook settings for this node.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8 mt-4"
                >   
                <FormField
                    control={form.control}
                    name="variableName"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Variable Name</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="MyDiscord"
                                 {...field} />
                            </FormControl>
                            <FormDescription>
                                use this name to reference the result in
                                other nodes:{" "}
                                {`{{${watchVariableName}.aiResponse}}`}
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />   
    <FormField
            control={form.control}
            name="webhookUrl"
            render={({field})=>(
                <FormItem>
                    <FormLabel>Webhook URL</FormLabel>
                        <FormControl>
                        <Input
                        placeholder="https://discord.com/api/wehooks/"
                        {...field}
                        />
                        </FormControl>
                        <FormDescription>
                            Get this from Discord: Channel Settings -&gt;
                            Integrations -&gt;
                        </FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
            />
                <FormField
                            control={form.control}
                            name="content"
                        render={({field})=>(
                        <FormItem>
                            <FormLabel>Message Content</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Summary:{{my}} "
                                 className="font-mono text-sm min-h-[80px]"
                                 {...field} />
                            </FormControl>
                            <FormDescription>
                                The message to send. Use {"{{variables}}"} for simple
                                values or {"{{json variable}}"} to stringfy object
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <FormField
            control={form.control}
            name="username"
            render={({field})=>(
                <FormItem>
                    <FormLabel>Bot Username (Optiona)</FormLabel>
                        <FormControl>
                        <Input
                        placeholder="Workflow Bot"
                        {...field}
                        />
                        </FormControl>
                        <FormDescription>
                            Override the webhook"s default username
                        </FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
            />
                
                    
                    <DialogFooter className="mt-4">
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </Form>
            </DialogContent>
    </Dialog>
  )
}