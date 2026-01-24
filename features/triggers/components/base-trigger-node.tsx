"use client"

import { BaseNode, BaseNodeContent } from "../../../components/base-node"
import { BaseHandle } from "../../../components/base-handle"
import { WorkflowNode } from "../../../components/workflow-node"
import { LucideIcon } from "lucide-react";
import { memo } from "react";
import Image from "next/image";
import { NodeProps, Position } from "@xyflow/react";


interface BaseTriggerNodeProps extends NodeProps {
    children?: React.ReactNode;
    description?: string;
    name: string;
    icon: LucideIcon | string;
    onSettings?: () => void;
    onDoubleClick?: () => void;
    onDelete?: () => void;
}

export const BaseTriggerNode = memo(({
    children,
    description,
    name,
    icon: Icon,
    onSettings,
    onDoubleClick,
    onDelete, 
}: BaseTriggerNodeProps) => {
    const handleDelete = () => {};
    return (
        <WorkflowNode
            name={name}
            description={description}
            onSettings={onSettings}
            onDelete={handleDelete}
        >
            <BaseNode onDoubleClick={onDoubleClick}
            className="relative rounded-l-2xl group"
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
        </WorkflowNode>
    );
});

BaseTriggerNode.displayName = "BaseTriggerNode";