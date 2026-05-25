import React from 'react'
import { toast } from 'sonner';


import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useExecutionParams } from './use-executions-params';

const useSuspenceExecutions = () => {
    const trpc = useTRPC()
    const [params] = useExecutionParams();
  return useSuspenseQuery(trpc.execution.getMany.queryOptions(params));
}

export default useSuspenceExecutions 




export const useSuspenceExecution=(id:string)=>{
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.execution.getOne.queryOptions({id}));
}


