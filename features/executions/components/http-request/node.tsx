"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GlobeIcon } from "lucide-react";
import { HttpRequestFormValues, HttpRequestDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { HTTP_REQUEST_CHANNEL_NAME, httpRequestChannel } from "@/inngest/channels/http-request";
import { fetchHttpRequestRealtimeToken } from "./actions";


type HttpRequestNodeData = {
    variableName: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
    // [key: string]: unknown;
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props:NodeProps<HttpRequestNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow();
    
    const nodeStatus = 
    useNodeStatus({
        nodeId:props.id,
        channel: HTTP_REQUEST_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchHttpRequestRealtimeToken,
    })

    const handleOpenSettings = () => setDialogOpen(true)


    const handleSubmit = (values:HttpRequestFormValues)=>{
        setNodes((nodes)=> nodes.map((node)=>{
            if(node.id === props.id){
                return { 
                    ...node, 
                    data:{
                        ...node.data,
                        ...values,
                        // endpoint:values.endpoint,
                        // method: values.method,
                        // body: values.body,
                    }
                }
            }
            return node;
        }))
    }

    const nodeData =  props.data;
    console.log(nodeData)
    const description = nodeData?.endpoint
     ?   `${nodeData.method || "GET"}: ${nodeData.endpoint}`: "Not configured"
     ;

     console.log(description)

     return (
        <>
        <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        />
        <BaseExecutionNode
            {...props}
            name="HTTP Request"
            description={description}
            icon={GlobeIcon}
            id={props.id}
            status={nodeStatus}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
        />
        </>
    );
});

HttpRequestNode.displayName = "HttpRequestNode";