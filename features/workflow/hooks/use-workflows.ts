import React from 'react'
import { toast } from 'sonner';
import { useWorkflowsParams } from './use-workflows-params';

import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

const useSuspenceWorkflows = () => {
    const trpc = useTRPC()
    const [params] = useWorkflowsParams();
  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
}

export default useSuspenceWorkflows 



export const useCreateWorkflows = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(trpc.workflows.create.mutationOptions ({
    onSuccess: (data) => {
      toast.success(`Workflow "${data.name}" created successfully`);
      queryClient.invalidateQueries(
        trpc.workflows.getMany.queryOptions({})
      )
    },
    onError: (error) => {
      toast.error(`Error creating workflow: ${error.message}`);
    }
  }));
}