"use client"

import { NodeProps } from "@xyflow/react";
import { memo } from "react"
import { PlaceholderNode } from "./placeholder-node";
import { PlusIcon } from "lucide-react";
import { WorkflowNode } from "./workflow-node";


export const InitialNode = memo((props: NodeProps) => {
    return (
        <WorkflowNode showToolbar={false} >
        <PlaceholderNode {...props} 
        onClick={()=>{}}>
            <div className="flex cursor-pointer items-center justify-center">
            <PlusIcon className="size-4"/>
            </div>
        </PlaceholderNode>
        </WorkflowNode>
    )
});

InitialNode.displayName = "InitialNode";