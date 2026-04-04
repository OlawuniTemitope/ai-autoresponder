"use client"

import { NodeType } from "@/lib/generated/prisma/browser";
import {createId} from "@paralleldrive/cuid2"
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import React, { useCallback } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "@radix-ui/react-separator";
import { useReactFlow } from "@xyflow/react";
import { se } from "date-fns/locale";
import { toast } from "sonner";


export type NodeTypeOption = {
    type:NodeType;
    label:string;
    description?:string;
    icon: React.ComponentType<{className?:string}> | string;
};

const triggerNode: NodeTypeOption[] = [
    {
        type:NodeType.MNUAL_TRIGGER,
        label: "Trigger manually",
        description: "Runs the flow on clicking a button. Good for getting started quickly",
        icon: MousePointerIcon,
    }
]
const executionNode: NodeTypeOption[] = [
    {
        type:NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Make an HTTP request",
        icon: GlobeIcon,
    }
]

interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const NodeSelector = ({open, onOpenChange,
     children}:NodeSelectorProps) => {
        const {setNodes, getNodes, screenToFlowPosition} = useReactFlow()

        const handleNodeSelect = useCallback((Selection: NodeTypeOption) => {
            if(Selection.type === NodeType.MNUAL_TRIGGER){
                const nodes = getNodes();
                const hasTriggerNode = nodes.some((node) => node.type === NodeType.MNUAL_TRIGGER);
                if(hasTriggerNode) {
                    toast.error("A trigger node already exists in this workflow");
                    return;
                }}
                setNodes((nodes) => {
                    const hasInitialTriggerNode = nodes.some(
                        (node) => node.type === NodeType.INITIAL);

                        const centerX = window.innerWidth / 2;
                        const centerY = window.innerHeight / 2;
                        const flowPosition = screenToFlowPosition({
                            x:centerX + (Math.random() -0.5) * 200,
                             y:centerY + (Math.random() -0.5) * 200,
                        });
                        const newNode = {
                            id: createId(),
                            type: Selection.type,
                            position: flowPosition,
                            data: {},
                        };
                        if(hasInitialTriggerNode){
                            return [newNode];
                        }

                        return [...nodes, newNode];
                    });
                    onOpenChange(false);
                }, [
            setNodes, getNodes,
            screenToFlowPosition,
            onOpenChange
                ]);
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                {children}
             </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md 
            overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        What triggers this workflow?
                    </SheetTitle>
                    <SheetDescription>
                        A trigger is a step that starts your workflow
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {triggerNode.map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                            <div 
                            key={nodeType.type}
                            className="w-full justify-start h-auto py-5 px-4
                            rounded-none cursor-pointer border-l-2 border-transparent
                            hover:border-l-primary"
                            onClick={()=>{handleNodeSelect(nodeType)}}
                            >
                                <div className="flex items-center">
                                    {
                                        typeof Icon === "string" ? (
                                            <img src={Icon} 
                                            alt={nodeType.label} 
                                            className="size-5 object-contain rounded-sm"/>)
                                    : ( <Icon className="size-5"/>)}
                                     <div className="flex flex-col items-start  text-left">
                                        <span className="font-medium text-sm">{nodeType.label}</span>
                                        <span className="text-xs text-muted-foreground">{nodeType.description}</span>
                                    </div>
                                </div>
                            </div>
                        )})}
                </div>
                <Separator/>
                <div>
                    {executionNode.map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                            <div 
                            key={nodeType.type}
                            className="w-full justify-start h-auto py-5 px-4
                            rounded-none cursor-pointer border-l-2 border-transparent
                            hover:border-l-primary"
                            onClick={()=>handleNodeSelect(nodeType)}
                            >
                                <div className="flext items-center">
                                    {
                                        typeof Icon === "string" ? (
                                            <img src={Icon} 
                                            alt={nodeType.label} 
                                            className="size-5 object-contain rounded-sm"/>)
                                    : ( <Icon className="size-5"/>)}
                                    <div className="flex flex-col items-start  text-left">
                                        <span className="text-xs to-muted-foreground">{nodeType.label}</span>
                                        <span className="text-xs text-muted-foreground">{nodeType.description}</span>
                                    </div>
                                </div>
                            </div>
                        )})}
                </div>
            </SheetContent>
        </Sheet>
    )
     }