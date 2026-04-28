"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription,
     DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CopyIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"


interface StripeTriggerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}
export const StripeTriggerDialog = (
    { open, onOpenChange }: StripeTriggerDialogProps
) => {
    const  params = useParams()
    const workflowId = params.workflowId as string

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" 
    
    const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;
    
    const  copyToClipboard = async () =>{
        try {
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied to clipboard");

        } catch{
            toast.error("Faiid to copy URL")
        }
    }
  return(
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Stripe Trigger Configuration</DialogTitle>
                <DialogDescription>
                    Configure this webhook URL in your Stripe dashboard to 
                    trigger this workflow on payment events.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="webhook-url">
                        Webhook URL
                    </label>
                    <div className="flex gap-2">
                        <Input
                        id="webhook-url"
                          value={webhookUrl}
                        readOnly
                        className="font-mono text-sm"
                        />
                        <Button
                        type="button"
                        size="icon"
                        variant= "outline"
                        onClick={copyToClipboard}
                        />
                        <CopyIcon className="size-4"/>
                    </div>
                </div>
                <div className="rounded-lg bg-muted p-4 space-y-1">
                    <h4 className="font-medium text-sm"> Setun instructions:</h4>
                    <ol className="text-sm to-muted-foreground space-y-1
                    list-decimal list-inside">
                        <li>Open your Stripe Dashboard</li>
                        <li>Go to developers -&gt; Webhooks</li>
                        <li>Click "Add endpoint</li>
                        <li>Past the webhook URL above</li>
                        <li>Select events to listen for (e.g., payment_intent.succeded)</li>
                        <li>Save and copr the signin secrete</li>
                    </ol>
                </div>
                <div className="rounded-lg bg-muted p-4 space-y-3">
                    <h4 className="font-medium text-sm"> Avaliable variables</h4>
                    <ul className="text-sm to-muted-foreground space-y-1">
                        <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{stripe.amount}}"} - Payment amount
                            </code>
                        </li>
                        <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{stripe.currency}}"} - Currency code
                            </code>
                        </li>
                        <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{stripe.customerId}}"} - Customer ID
                            </code>
                        </li>
                        <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{json stripe}}"} - Full even data as JSON
                            </code>
                        </li>
                        <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{stripe.eventType}}"} - type (e.g payment_intent.succeded)
                            </code>
                        </li>
                    </ul>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}