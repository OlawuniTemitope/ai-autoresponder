import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";


type Input = inferInput<typeof trpc.Credential.getMany>;

export const prefetchExecutions = (params: Input) =>{
    return prefetch(trpc.execution.getMany.queryOptions(params))
}

export const prefetchExecution = (id: string) =>{
    return prefetch(trpc.execution.getOne.queryOptions({id}))
}