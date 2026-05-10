"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";

import { useNodeStatus } from "../../hooks/use-node-status";
import { OpenAiDialog, OpenAiFormValues } from "./dialog";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/open-ai";
import { fetchOpenAiRealtimeToken } from "./actions";



type OpenAiNodeData = {
    variableName?: string
    systemPrompt?: string;
    credentialId?: string,
    userPrompt?: string
}

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props:NodeProps<OpenAiNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow();
    
    const nodeStatus = 
    useNodeStatus({
        nodeId:props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAiRealtimeToken,
    })

    const handleOpenSettings = () => setDialogOpen(true)


    const handleSubmit = (values:OpenAiFormValues)=>{
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
     ?  `gpt-4 : ${nodeData.userPrompt.slice(0,50)}...`: "Not configured"
     ;

    //  console.log(description)

     return (
        <>
        <OpenAiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        />
        <BaseExecutionNode
            {...props}
            name="OpenAi"
            description={description}
            icon="/images/openai.svg"
            id={props.id}
            status={nodeStatus}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
        />
        </>
    );
});

OpenAiNode.displayName = "OpenAiNode";