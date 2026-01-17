"use client"
import { EntityContainer, EntityHeader, EntityPagination, EntitySerch } from '@/components/entity-components'
import useSuspenceWorkflows, { useCreateWorkflows } from '../hooks/use-workflows'
import { useUpgradeModal } from '@/hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'
import { useWorkflowsParams } from '../hooks/use-workflows-params'
import { useEntitySearch } from '@/hooks/use-entity-search'

export  const WorkflowSearch = () =>{
 const [params, setParams] = useWorkflowsParams()

 const { serachValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
 })
  return (

    <EntitySerch
    value={serachValue}
    onChange={onSearchChange}
    placeholder='Search Workflows'
    />
  )
}

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

export const WorkflowsPagination =()=>{
  const workflows = useSuspenceWorkflows()
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
    disabled={workflows.isFetching}
    totalPages={workflows.data.totalPages}
    page={workflows.data.page}
    onPageChange={(page) => setParams({...params, page})}
    />
  )
}


export const WorkflowContainer =({children}:{children:React.ReactNode}) =>{
  return (
    <EntityContainer
    header={<WorkflowsHeader/>}
    search={<WorkflowSearch/>}
    pagination={<WorkflowsPagination/>}
    >
      {children}
    </EntityContainer>
  )
}