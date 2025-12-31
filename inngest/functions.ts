import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { inngest } from "./client";
import { generateText } from "ai";
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';


const google = createGoogleGenerativeAI()
const openai = createOpenAI()
const anthropic = createAnthropic()

export const excecute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s")
    const {steps : geminiSteps} = await step.ai.wrap(
      "gemini-generate-text",
      generateText, 
      {
        model: google('gemini-2.5-flash'),
        system: "You are a helpful assistant that helps users with their tasks.",
        prompt: "what is 2+2?",
      }
    )
    const {steps: openaiSteps} = await step.ai.wrap(
      "openai-generate-text",
      generateText, 
      {
        model: openai('gpt-4'),
        system: "You are a helpful assistant that helps users with their tasks.",
        prompt: "what is 2+2?",
      }
    )
    const {steps: anthropicSteps} = await step.ai.wrap(
      "anthropic-generate-text",
      generateText, 
      {
        model: anthropic('claude-3-5-sonnet'),
        system: "You are a helpful assistant that helps users with their tasks.",
        prompt: "what is 2+2?",
      }
    )
    return {
      gemini: geminiSteps,
      openai: openaiSteps,
      anthropic: anthropicSteps,
    };
  },
);