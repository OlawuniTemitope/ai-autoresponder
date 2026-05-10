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
import { useCredentialsByType } from "@/features/credential/hooks/use-credentials";
import { CredentialType } from "@/lib/generated/prisma/enums";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

 
const formSchema = z.object({
    variableName: z.string().min(1,{message: "Variable bame is required"}).regex(/^[A-Za-z0-9_$]*$/, {
        message: "variable name must start with a letter or underscore and contain only latters, numbers, and underscores"
    }),
    credentialId: z.string().min(1, "Credential is required"),
    model: z.string().min(1, "Model is required"),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "User prompt is required")
})

export type GeminiFormValues = z.infer<typeof formSchema>;
interface GeminiDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void; 
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?:Partial<GeminiFormValues>
}
export const GeminiDialog = (
    { 
        open,
         onOpenChange,
         onSubmit,
          defaultValues = {},
         }: GeminiDialogProps
) => {

    const {
        data:credentialData,
        isLoading:isLoadingCredentials,
    } = useCredentialsByType(CredentialType.GEMINI)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            credentialId:defaultValues.credentialId || "",
            variableName: defaultValues.variableName || "",
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || "",
        },
    })

    useEffect(() => {
        if(open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                credentialId:defaultValues.credentialId || "",
                systemPrompt: defaultValues.systemPrompt || "",
                userPrompt: defaultValues.userPrompt || "",})
        }
    },[open, defaultValues, form])

    const watchVariableName = form.watch("variableName") || "myGemini"

    
    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
        onOpenChange(false)
    }
  return(
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Gemini Configuration</DialogTitle>
                <DialogDescription>
                    Configure the AI model and prompts for this node.
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
                                placeholder="My Gemini Result"
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
                                        name="credentialId"
                                        render={({field})=>(
                                            <FormItem>
                                                <FormLabel>Geminni Credential</FormLabel>
                                                <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={
                                                    isLoadingCredentials ||
                                                    !credentialData?.length
                                                }
                                                >
                                                    <FormControl>
                                                        <SelectTrigger
                                                         className="w-full"
                                                         >
                                                            <SelectValue placeholder= "Select a credential"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            credentialData?.map((credential)=>(
                                                                <SelectItem
                                                                key={credential.id}
                                                                value={credential.id}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <Image
                                                                        src="/images/gemini.svg"
                                                                        alt="Gemini"
                                                                        width={16}
                                                                        height={16}
                                                                        />
                                                                        {credential.name}
                                                                    </div>
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                        />
                                        
                            <FormField
                            control={form.control}
                            name="systemPrompt"
                        render={({field})=>(
                        <FormItem>
                            <FormLabel>System Prompt (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="You are a helpful assistant"
                                 className="font-mono text-sm min-h-[80px]"
                                 {...field} />
                            </FormControl>
                            <FormDescription>
                                Sets the behavior of the assistant. Use {"{{variable}}"} for
                                simple values or {"{{json variable}}"} to
                                stringify objects
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    
                            <FormField
                            control={form.control}
                            name="systemPrompt"
                        render={({field})=>(
                        <FormItem>
                            <FormLabel>System Prompt (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="You are a helpful assistant"
                                 className="font-mono text-sm min-h-[80px]"
                                 {...field} />
                            </FormControl>
                            <FormDescription>
                                Sets the behavior of the assistant. Use {"{{variable}}"} for
                                simple values or {"{{json variable}}"} to
                                stringify objects
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    
                            <FormField
                            control={form.control}
                            name="userPrompt"
                        render={({field})=>(
                        <FormItem>
                            <FormLabel>User Prompt</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Summarize this text text:{{json ApiResponse.data"
                                 className="font-mono text-sm min-h-[120px]"
                                 {...field} />
                            </FormControl>
                            <FormDescription>
                                The prompt to srnd to AI. Use {"{{variable}}"} for
                                simple values or {"{{json variable}}"} to
                                stringify objects
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )} />
                
                    
                    <DialogFooter className="mt-4">
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </Form>
            </DialogContent>
    </Dialog>
  )
}