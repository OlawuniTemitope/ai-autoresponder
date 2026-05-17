"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";

import { useNodeStatus } from "../../hooks/use-node-status";
import { SlackDialog, SlackFormValues } from "./dialog";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";
import { fetchSlackRealtimeToken } from "./actions";





type SlackNodeData = {
   webhookUrl?: string,
   content?:string;
   username?:string
}

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props:NodeProps<SlackNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow();
    
    const nodeStatus = 
    useNodeStatus({
        nodeId:props.id, 
        channel: SLACK_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchSlackRealtimeToken,
    })

    const handleOpenSettings = () => setDialogOpen(true)


    const handleSubmit = (values:SlackFormValues)=>{
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
        <SlackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        />
        <BaseExecutionNode
            {...props}
            name="Slack"
            description={description}
            icon="/images/slack.svg"
            id={props.id}
            status={nodeStatus}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
        />
        </>
    );
});

SlackNode.displayName = "SlackNode";