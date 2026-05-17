"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";

import { useNodeStatus } from "../../hooks/use-node-status";
import { DiscordDialog, DiscordFormValues } from "./dialog";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";
import { fetchDiscordRealtimeToken } from "./actions";




type DiscordNodeData = {
   webhookUrl?: string,
   content?:string;
   username?:string
}

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props:NodeProps<DiscordNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow();
    
    const nodeStatus = 
    useNodeStatus({
        nodeId:props.id, 
        channel: DISCORD_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchDiscordRealtimeToken,
    })

    const handleOpenSettings = () => setDialogOpen(true)


    const handleSubmit = (values:DiscordFormValues)=>{
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
    const description = nodeData?.content
     ?  `"Send" : ${nodeData.content.slice(0,50)}...`: "Not configured"
     ;

    //  console.log(description)

     return (
        <>
        <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        />
        <BaseExecutionNode
            {...props}
            name="Discord"
            description={description}
            icon="/images/discord.svg"
            id={props.id}
            status={nodeStatus}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
        />
        </>
    );
});

DiscordNode.displayName = "DiscordNode";