"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";

import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRealtimeToken } from "./actions";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";
import { GeminiDialog, GeminiFormValues } from "./dialog";


type GeminiNodeData = {
    variableName?: string
    credentialId?: string,
    systemPrompt?: string;
    userPrompt?: string
}

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props:NodeProps<GeminiNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow();
    
    const nodeStatus = 
    useNodeStatus({
        nodeId:props.id,
        channel: GEMINI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGeminiRealtimeToken,
    })

    const handleOpenSettings = () => setDialogOpen(true)


    const handleSubmit = (values:GeminiFormValues)=>{
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
    // console.log(nodeData)
    const description = nodeData?.userPrompt
     ?  `gemini-2.0-flash : ${nodeData.userPrompt.slice(0,50)}...`: "Not configured"
     ;

    //  console.log(description)

     return (
        <>
        <GeminiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        />
        <BaseExecutionNode
            {...props}
            name="Gemini"
            description={description}
            icon="/images/gemini.svg"
            id={props.id}
            status={nodeStatus}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
        />
        </>
    );
});

GeminiNode.displayName = "GeminiNode";