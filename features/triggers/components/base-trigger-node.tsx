"use client"

import { BaseNode, BaseNodeContent } from "../../../components/react-flow/base-node"
import { BaseHandle } from "../../../components/react-flow/base-handle"
import { WorkflowNode } from "../../../components/workflow-node"
import { LucideIcon } from "lucide-react";
import { memo } from "react";
import Image from "next/image";
import { NodeProps, Position, useReactFlow } from "@xyflow/react";
import { NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";


interface BaseTriggerNodeProps extends NodeProps {
    children?: React.ReactNode;
    description?: string;
    name: string;
    icon: LucideIcon | string;
    status?: NodeStatus
    onSettings?: () => void;
    onDoubleClick?: () => void;
    onDelete?: () => void;
}

export const BaseTriggerNode = memo(({
    id,
    children,
    description,
    name,
    status="initial",
    icon: Icon,
    onSettings,
    onDoubleClick,
    onDelete, 
}: BaseTriggerNodeProps) => {
    const {setNodes, setEdges} = useReactFlow();

    
    const handleDelete = () => {
        setNodes((currentNodes)=>{
            const updatedNodes = currentNodes.filter(
                (node) => node.id !== id);
            return updatedNodes;
        });

        setEdges((currentEdges)=>{
            const updatedEdges = currentEdges.filter(
                (edge) => edge.source !== id && edge.target !== id);
            return updatedEdges;
        })
    };
    return (
        <WorkflowNode
            name={name}
            description={description}
            onSettings={onSettings}
            onDelete={handleDelete}
        >
            <NodeStatusIndicator
            status={status}
            variant="border"
            className="rounded-l-2xl"
            >
            <BaseNode
            status={status}
            onDoubleClick={onDoubleClick}
            className="relative rounded-l-2xl group:"
            >
                <BaseNodeContent>
                    {
                        typeof Icon === "string" ? (
                            <Image src={Icon} alt={name} width={16} height={16} />
                        ) : (
                            <Icon className="size-4 text-muted-foreground" />
                        )
                    }
                    {children}
                    <BaseHandle
                        id="source-1"
                        type="source"
                        position={Position.Right}
                    />
                </BaseNodeContent>
            </BaseNode>
            </NodeStatusIndicator>
        </WorkflowNode>
    );
});

BaseTriggerNode.displayName = "BaseTriggerNode";