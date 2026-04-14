import { channel, topic } from "@inngest/realtime"

export const MANUAL_TRIGGER_CHANNEL_NAME ="manual_trigger-execution"
export const manualTriggerChannel = channel(MANUAL_TRIGGER_CHANNEL_NAME)
.addTopic(
    topic("status").type<{
        nodeId: string;
        status: "loading" | "success" | "error"
    }>()
);