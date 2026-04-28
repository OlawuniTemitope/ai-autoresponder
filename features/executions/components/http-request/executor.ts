import Handlebars from "handlebars"
import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { Options as KyOptions } from "ky"
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json", (context)=>
   { const jsonString = JSON.stringify(context, null, 2);
    const safestring = new Handlebars.SafeString(jsonString)
    return safestring
   })
type HttpRequestData = {
    variableName?: string,
    endpoint?: string,
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string,
}


export const httpRrequestExecutor: NodeExecutor<HttpRequestData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) =>{
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "loading"
        })
    )

try{
    
    const result = await step.run("http-request", async () => {
        
    if(!data.endpoint){
        await publish(
        httpRequestChannel().status({
            nodeId,
            status: "error"
        })
    )
        throw new NonRetriableError("HTTP Request node: No endpoint configured")
    }

    if(!data.variableName){
        await publish(
        httpRequestChannel().status({
            nodeId,
            status: "error"
        })
    )
        throw new NonRetriableError("Variable name not configured")
    }
    if(!data.method){
        await publish(
        httpRequestChannel().status({
            nodeId,
            status: "error"
        })
    )
        throw new NonRetriableError("Method name not configured")
    }
        const endpoint = Handlebars.compile(data.endpoint)(context);
        const method = data.method || "GET";
        const options: KyOptions = {method};

        if(["POST", "PUT", "PATCH"].includes(method)){
                const resolved = Handlebars.compile(data.body || "{}")(context)
                JSON.parse(resolved);
                options.body = resolved;
                options.headers= {
                    "Content-Type":"application/json"
                }
            }

            const response = await ky(endpoint, options);

            const contentType = response.headers.get("content-type");

            const responseData = contentType?.includes("application/json") ?
            await response.json()
            : await response.text();

            const responsePayload = {
                httpResponse:{
                    status:response.status,
                    statusText: response.statusText,
                    data: responseData
                }
            }

            console.log({"contextt":{responseData}}, {paylod: {responsePayload}})
            return {
                ...context,
                [data.variableName]: responsePayload,
                // httpResponse:{
                //     status:response.status,
                //     statusText: response.statusText,
                //     data: responseData
                // }
            }
            
        }
    );
    // console.log("HTTP Request result:", result);
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "success"
        })
    )
    return result
} catch (error){
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "success"
        })
    );
    throw error;
}
}