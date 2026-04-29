import Handlebars from "handlebars"
import { NodeExecutor } from "@/features/executions/types";
import {generateText} from "ai"
import {anthropic, createAnthropic} from "@ai-sdk/anthropic"
import { NonRetriableError } from "inngest";
import { anthropicChannel } from "@/inngest/channels/anthropic";


Handlebars.registerHelper("json", (context)=>
   { const jsonString = JSON.stringify(context, null, 2);
    const safestring = new Handlebars.SafeString(jsonString)
    return safestring
   })
type AnthropicData = {
    variableName?: string,
   model?: string,
    systemPrompt?: string;
    userPrompt?: string
}


export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) =>{
    await publish(
        anthropicChannel().status({
            nodeId,
            status: "loading"
        })
    );

    if (!data.variableName){
        await publish(
        anthropicChannel().status({
            nodeId,
            status: "success"
        }))

        throw new NonRetriableError(" Anthropic node: Variable name is missing")
    };
    if (!data.userPrompt){
        await publish(
        anthropicChannel().status({
            nodeId,
            status: "success"
        }))

        throw new NonRetriableError(" Anthropic node: User Prompt is missing")
    };

    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";

    const userPrompt =Handlebars.compile(data.userPrompt)(context)

    const credentialValue = process.env.ANTHROPIC_API_KEY

    const Anthropic = createAnthropic({
        apiKey: credentialValue,
    })

try{
    const {steps} = await step.ai.wrap(
        "anthropic-generate-text",
        generateText,
        {
            model: anthropic(data.model || "claude-sonnet-4-5-20250929"),
            system: systemPrompt,
            prompt: userPrompt,
            experimental_telemetry: {
                isEnabled: true,
                recordInputs: true,
                recordOutputs: true
            }
        }
    );
    const text = steps[0].content[0].type === "text" ? 
    steps[0].content[0].text : "";

    await publish(
        anthropicChannel().status({
            nodeId,
            status: "success"
        })
    );

    return {
        ...context,
        [data.variableName]:{
            text,
        }
    }

    } catch (error){
    await publish(
        anthropicChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw error;
}
}