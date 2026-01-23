import { InitialNode } from "@/components/initial-node";
import { NodeType } from "@/lib/generated/prisma/enums";
import { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes;

export type ResisteredNodeType = keyof typeof nodeComponents;