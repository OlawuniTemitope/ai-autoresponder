"use client"

import { ErrorView, LoadingView } from "@/components/entity-components"
import { useSuspenceWorkflow } from "@/features/workflow/hooks/use-workflows"
import { useCallback, useMemo, useState } from "react"
import {Node, Edge, applyEdgeChanges, applyNodeChanges,
     addEdge, NodeChange, Connection, ReactFlow, EdgeChange,
      Background, Controls, MiniMap,
      Panel} from "@xyflow/react"
      import { nodeComponents } from "@/config/node-components"
      import { AddNodeButton } from "./add-node-button"
      import { useSetAtom } from "jotai"
      import { editorAtom } from "../store/atom"
      
      import '@xyflow/react/dist/style.css';
import { NodeType } from "@/lib/generated/prisma/enums"
import ExecuteWorkflowButton from "./execute-workflow-button"
      
export const EditorLoading = () =>{
    return <LoadingView message="Loading editor"/>
}

export const EditorError = () =>{
    return <ErrorView message="Error loading editor"/>
}



export const Editor =({workflowId}:{workflowId:string})=>{

    const {data: workflow} = useSuspenceWorkflow(workflowId);

    const setEditor = useSetAtom(editorAtom)

      const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
      const [edges, setEdges] = useState<Edge[]>(workflow.edges);

        const onNodesChange = useCallback(
            (changes: NodeChange[]) => setNodes((nodesSnapshot)=>
                applyNodeChanges(changes, nodesSnapshot)),
            [],
        );
        const onEdgesChange = useCallback(
            (changes:EdgeChange[]) => setEdges((edgesSnapshot)=>
                applyEdgeChanges(changes, edgesSnapshot)),
            [],
        );
        const onConnect = useCallback(
            (params:Connection) => setEdges((edgesSnapshot)=>
                addEdge(params, edgesSnapshot)),
            [],
        );

        const hasManualTrigger = useMemo(()=>{
            return nodes.some((node)=>node.type === NodeType.MNUAL_TRIGGER)
        },[nodes])


    return (
        <div className="size-full">
            <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeComponents}
            onInit={setEditor}
            fitView
            snapGrid={[10, 10]}
            snapToGrid
            panOnScroll
            panOnDrag={false}
            selectionOnDrag
            >
                <Background/>
                <Controls/>
                <MiniMap/>
                <Panel position="top-right">
                    <AddNodeButton/>
                </Panel>
                {
                <Panel position="bottom-center">
                    <ExecuteWorkflowButton workflowId={workflowId}/>
                </Panel>
                }
            </ReactFlow>
        </div>
    )
}