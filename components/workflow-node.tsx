import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "./ui/button";
import { SettingsIcon } from "lucide-react";

interface WorkflowNodeProps {
    children: React.ReactNode;
    name?: string;
    description?: string;
    onDelete?: () => void;
    onSettings?: () => void;
    showToolbar?: boolean;
}

export function WorkflowNode({ children, name, description, 
    onDelete, onSettings, showToolbar }: WorkflowNodeProps) {
    return (
        <>
        {
            showToolbar && (
                <NodeToolbar>
                    <Button size="sm" variant="ghost" onClick={onSettings}>
                        <SettingsIcon className="size-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={onDelete}>
                        <SettingsIcon className="size-4" />
                    </Button>
                </NodeToolbar>
            )
        }
        {children}
        {name && (
            <NodeToolbar 
            position={Position.Bottom}
            isVisible
            className="max-w-[200px] text-center"
            >
                <p className="font-medium">{name}</p>
                {description && (<p className="to-muted-foreground text-sm truncate">
                    {description}
                    </p>)}
            </NodeToolbar>
        )}
        </>
    );
}