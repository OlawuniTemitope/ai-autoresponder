"use server"

import { httpRequestChannel } from "@/inngest/channels/http-request"
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime"



export type httpRequestToken = Realtime.Token<
 typeof httpRequestChannel,
 ["status"]
 >;

 export async function fetchHttpRequestRealtimeToken(): Promise<httpRequestToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: httpRequestChannel(),
        topics: ["status"],
    });
    return token;
}