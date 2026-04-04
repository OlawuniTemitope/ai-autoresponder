import { NodeType } from "@/lib/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRrequestExecutor } from "../components/http-request/executor";

export const executorRegistry:Record<NodeType, NodeExecutor> ={
    [NodeType.MNUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRrequestExecutor,
}

export const getExecutor = (type: NodeType): NodeExecutor =>{
    const executor = executorRegistry[type];
    if(!executor){
        throw new Error(`No executor found fpr node type: ${type}`);
    }

    return executor
}