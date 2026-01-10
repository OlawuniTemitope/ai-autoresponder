"use client"
import { EntityContainer, EntityHeader } from '@/components/entity-components'
import useSuspenceWorkflows, { useCreateWorkflows } from '../hooks/use-workflows'
import { useUpgradeModal } from '@/hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'

 export const WorkflowList = () => {
    const workflows = useSuspenceWorkflows()
  return (
    <p>
        {JSON.stringify(workflows.data, null, 2)}
    </p>
  )
}

export const WorkflowsHeader = ({disabled}: {disabled?:boolean}) =>{

   const createWorkflows = useCreateWorkflows()
   const {modal, handleError} = useUpgradeModal()
   const router = useRouter()

   const handleCreate = () => {
    createWorkflows.mutate(undefined,{
      onSuccess:(data) => {
        router.push(`/workflows/${data.id}`)
      },
      onError:(error) => {
        handleError(error);
      }
    });
   }

  return(
    <>
    {modal}
    <EntityHeader
    title="workflows"
    description="create and manage your workflow"
    onNew={handleCreate}
    newButtonLabel='New workflow'
    disabled={disabled}
    isCreating={createWorkflows.isPending}
    />
    </>
  )
}


export const WorkflowContainer =({children}:{children:React.ReactNode}) =>{
  return (
    <EntityContainer
    header={<WorkflowsHeader/>}
    search={<></>}
    pagination={<></>}
    >
      {children}
    </EntityContainer>
  )
}