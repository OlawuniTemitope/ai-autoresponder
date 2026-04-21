import { Connection, Node } from "@/lib/generated/prisma/client";
import toposort from "toposort"
import { inngest } from "./client";


export const topologicalSort = (
    nodes: Node[],
    connections: Connection[],
): Node[] => {
    if(connections.length === 0){
        return nodes;
    }

    // create array to toposrt

    const edges: [string, string][] = connections.map((conn)=>[
        conn.fromNodeId,
        conn.toNodeId
    ])

    const connectiedNodeIds = new Set<string>();
    for (const conn of connections){
        connectiedNodeIds.add(conn.fromNodeId)
        connectiedNodeIds.add(conn.toNodeId)
    }

    for (const node of nodes){
        if(!connectiedNodeIds.has(node.id)){
            edges.push([node.id, node.id])
        }
    }

    let sortedNodeIds: string[];
    try {
        sortedNodeIds = toposort(edges)
        sortedNodeIds = [...new Set(sortedNodeIds)]
    } catch (error) {
        if(error instanceof Error && error.message.includes("Cyclic")) {
            throw new Error("Cyclic dependency detected in the workflow. Please check your connections.")
        }       
         throw error;
    }

    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    return sortedNodeIds.map(id => nodeMap.get(id) as Node).filter(Boolean);
}

export const sendWorkflowExecution = async (data:{
    workflowId:string,
    [key:string]: any
})=>{
    return inngest.send({
        name: "workflows/execute.workflow",
        data,
    })
}