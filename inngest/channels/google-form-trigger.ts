import { channel, topic } from "@inngest/realtime"

export const GOOGLE_FORM_TRIGGER_CHANNEL_NAME ="google_form_trigger-execution"
export const googleformTriggerChannel = 
channel(GOOGLE_FORM_TRIGGER_CHANNEL_NAME)
.addTopic(
    topic("status").type<{
        nodeId: string;
        status: "loading" | "success" | "error"
    }>()
);