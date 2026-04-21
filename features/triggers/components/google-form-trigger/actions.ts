"use server"

import { googleformTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime"



export type GoogleFormTriggerToken = Realtime.Token<
 typeof googleformTriggerChannel,
 ["status"]
 >;


 export async function fetchGoogleFormTriggerRealtimeToken(): Promise<GoogleFormTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: googleformTriggerChannel(),
        topics: ["status"],
    });
    return token;
}