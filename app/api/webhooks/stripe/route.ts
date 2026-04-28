import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest) {
    try {
        const url = new URL(request.url);
        const workflowId = url.searchParams.get("workflowId");

        if(!workflowId){
            return NextResponse.json(
                {success:false, error: "Missing required query parameter: workflowId"}
             ,   {status:400}
            );
        }
        const body = await request.json();
        const stripeformData = {
            eventId: body.id,
            eventType: body.type,
            timestanp:body.created,
            livemode: body.livemode,
            raw: body.data?.object
        }
        await sendWorkflowExecution({
            workflowId,
            initialData:{
                stripe: stripeformData
            }
        });
        return NextResponse.json(
            {success:true},
            {status:200}
        )
    } catch (error) {
     console.error("Stripe webhook error:", error);
     return NextResponse.json(
        {success:false, error: "Failed to proccess Stripe event"}
         ,   {status:400}
     )   
    }
}