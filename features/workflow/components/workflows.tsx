"use client"
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySerch, ErrorView, LoadingView } from '@/components/entity-components'
import useSuspenceWorkflows, { useCreateWorkflows, useDeleteWorkflow } from '../hooks/use-workflows'
import { useUpgradeModal } from '@/hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'
import { useWorkflowsParams } from '../hooks/use-workflows-params'
import { useEntitySearch } from '@/hooks/use-entity-search'
import { WorkflowIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Workflow } from '@/lib/generated/prisma/browser'

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
      <EntityList
      items={workflows.data.items}
      getKey={(workflows) => workflows.id}
      renderItem={(workflow) => <WorkflowsItem data={workflow}/>} 
      emptyView={<WorkFlowEmpty />}
      />
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

export const WorkFlowLoading =() =>{
  return <LoadingView message='Loading Workflows' />;
}
export const WorkFlowError =() =>{
  return <ErrorView message='Error loading Workflows' />;
}

export const WorkFlowEmpty =() =>{
  const router = useRouter();
  const createWorkflows = useCreateWorkflows()
  const {modal, handleError} = useUpgradeModal()
  const handleCreate = () => {
    createWorkflows.mutate(undefined,{
      onError:(error) => {
        handleError(error);
      },
      onSuccess:(data) => {
        router.push(`/workflows/${data.id}`)
      }
    });};
    return(
      <>
      {modal}
      <EmptyView
      onNew={handleCreate}
      message="You haven't created any workflows yet. Get started by 
      creating a new workflow."
      />
      </>
    )
  }

  export const WorkflowsItem = ({data}: {data:Workflow}) =>{

    const removeWorkFlow = useDeleteWorkflow()

    const handleRemove = () => {
      removeWorkFlow.mutate({id:data.id})
    }
    return(
      <EntityItem
      href={`/workflows/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, {addSuffix: true})} {'  '}{" "}
             &bull; Created{'  '}
          {formatDistanceToNow(data.createdAt, {addSuffix: true})}
        </>
      }
      image={
        <div className='size-8 flex items-center justify-center'>
          <WorkflowIcon className='size-5 text-muted-foreground'/>
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkFlow.isPending}
      />
    )

  }
