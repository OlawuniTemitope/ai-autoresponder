// import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/lib/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleformTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
// import { generateText } from "ai";
// import { createOpenAI } from '@ai-sdk/openai';
// import { createAnthropic } from '@ai-sdk/anthropic';


// const google = createGoogleGenerativeAI()
// const openai = createOpenAI()
// const anthropic = createAnthropic()

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", 
    // retries:0
  },
  { 
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleformTriggerChannel(),
      stripeTriggerChannel()
    ]
   },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;
    if(!workflowId){
      throw new NonRetriableError("Workflow ID is missing")
    }
    const sortedNodes = await step.run("prepare-workflow", async()=>{
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where:{id:workflowId},
        include:{
          nodes:true,
          connections:true,
        }
      });
        return topologicalSort(workflow.nodes, workflow.connections);
    });

    let context = event.data.initialData || {};

    for(const node of sortedNodes){
      const executor = getExecutor(node.type as NodeType);

      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
      })
    }
    return {
      workflowId,
      result: context,
    }
    // await step.sleep("pretend", "5s")
    // const {steps : geminiSteps} = await step.ai.wrap(
    //   "gemini-generate-text",
    //   generateText, 
    //   {
    //     model: google('gemini-2.5-flash'),
    //     system: "You are a helpful assistant that helps users with their tasks.",
    //     prompt: "what is 2+2?",
    //   }
    // )
    // const {steps: openaiSteps} = await step.ai.wrap(
    //   "openai-generate-text",
    //   generateText, 
    //   {
    //     model: openai('gpt-4'),
    //     system: "You are a helpful assistant that helps users with their tasks.",
    //     prompt: "what is 2+2?",
    //   }
    // )
    // const {steps: anthropicSteps} = await step.ai.wrap(
    //   "anthropic-generate-text",
    //   generateText, 
    //   {
    //     model: anthropic('claude-3-5-sonnet'),
    //     system: "You are a helpful assistant that helps users with their tasks.",
    //     prompt: "what is 2+2?",
    //   }
    // )
    // return {
    //   gemini: geminiSteps,
    //   openai: openaiSteps,
    //   anthropic: anthropicSteps,
    // };
  },
);