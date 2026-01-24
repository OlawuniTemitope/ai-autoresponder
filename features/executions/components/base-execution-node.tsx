"use client"

import { BaseNode, BaseNodeContent } from "../../../components/base-node"
import { BaseHandle } from "../../../components/base-handle"
import { WorkflowNode } from "../../../components/workflow-node"
import { LucideIcon } from "lucide-react";
import { memo } from "react";
import Image from "next/image";
import { NodeProps, Position } from "@xyflow/react";


interface BaseExecutionNodeProps extends NodeProps {
    children?: React.ReactNode;
    description?: string;
    name: string;
    icon: LucideIcon | string;
    onSettings?: () => void;
    onDoubleClick?: () => void;
    onDelete?: () => void;
}

export const BaseExecutionNode = memo(({
    children,
    description,
    name,
    icon: Icon,
    onSettings,
    onDoubleClick,
    onDelete, 
}: BaseExecutionNodeProps) => {
    const handleDelete = () => {};
    return (
        <WorkflowNode
            name={name}
            description={description}
            onSettings={onSettings}
            onDelete={handleDelete}
        >
            <BaseNode onDoubleClick={onDoubleClick}>
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
                        id="target-1"
                        type="target"
                        position={Position.Left}
                    />
                    <BaseHandle
                        id="source-1"
                        type="source"
                        position={Position.Right}
                    />
                </BaseNodeContent>
            </BaseNode>
        </WorkflowNode>
    );
});

BaseExecutionNode.displayName = "BaseExecutionNode";