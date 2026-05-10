import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";


type Input = inferInput<typeof trpc.Credential.getMany>;

export const prefetchCredentials = (params: Input) =>{
    return prefetch(trpc.Credential.getMany.queryOptions(params))
}

export const prefetchCredential = (id: string) =>{
    return prefetch(trpc.Credential.getOne.queryOptions({id}))
}