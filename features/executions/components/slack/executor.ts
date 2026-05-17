import Handlebars from "handlebars"
import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import {decode} from "html-entities"
import ky from "ky";
import { slackChannel } from "@/inngest/channels/slack";


Handlebars.registerHelper("json", (context)=>
   { const jsonString = JSON.stringify(context, null, 2);
    const safestring = new Handlebars.SafeString(jsonString)
    return safestring
   })
type SlackData = {
    variableName?: string,
    webhookUrl?: string,
    content?:string;
}


export const SlackExecutor: NodeExecutor<SlackData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) =>{
    await publish(
        slackChannel().status({
            nodeId,
            status: "loading"
        })
    );

    if (!data.webhookUrl){
        await publish(
        slackChannel().status({
            nodeId,
            status: "error"
        }))

        throw new NonRetriableError(" Slack node: Variable name is missing")
    };
    if (!data.content){
        await publish(
        slackChannel().status({
            nodeId,
            status: "error"
        }))

        throw new NonRetriableError(" Slack node: User Prompt is missing")
    };

    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);

    
        

try{
    const result = await step.run("slack-webhook", async () => {

        
    if (!data.webhookUrl){
        await publish(
        slackChannel().status({
            nodeId,
            status: "error"
        }))

        throw new NonRetriableError(" Slack node: Variable name is missing")
    };

        await ky.post(data.webhookUrl, {
            json:{
               content: content,
            }
        });

        
    if (!data.variableName){
        await publish(
        slackChannel().status({
            nodeId,
            status: "error"
        }))

        throw new NonRetriableError(" Slack node: Variable name is missing")
    };
        return {
        ...context,
        [data.variableName]:{
            messageContent:content.slice(0, 2000),
        }
    }

    });
    await publish(
        slackChannel().status({
            nodeId, 
            status: "success"
        })
    );
    return result
    } catch (error){
    await publish(
        slackChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw error;
}
}