"use client"

import { Node, NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GlobeIcon } from "lucide-react";


type HttpRequestNodeData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
    [key: string]: unknown;
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props:NodeProps<HttpRequestNodeType>) => {
    const nodeData =  props.data as HttpRequestNodeData;
    const description = nodeData?.endpoint
     ? `${nodeData.method || "GET"}: ${nodeData.endpoint}` 
     : "Not configured";

     return (
        <>
        <BaseExecutionNode
            name="HTTP Request"
            description={description}
            {...props}
            icon={GlobeIcon}
            id={props.id}
            onSettings={()=>{}}
            onDoubleClick={()=>{}}
        />
        </>
    );
});

HttpRequestNode.displayName = "HttpRequestNode";