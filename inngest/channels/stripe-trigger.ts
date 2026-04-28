import { channel, topic } from "@inngest/realtime"

export const STRIPE_TRIGGER_CHANNEL_NAME ="stripe_trigger-execution"
export const stripeTriggerChannel = 
channel(STRIPE_TRIGGER_CHANNEL_NAME)
.addTopic(
    topic("status").type<{
        nodeId: string;
        status: "loading" | "success" | "error"
    }>()
);