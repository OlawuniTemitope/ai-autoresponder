import React from 'react'
import { toast } from 'sonner';


import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useCredentialsParams } from './use-credentials-params';
import { CredentialType } from '@/lib/generated/prisma/enums';

const useSuspenceCredentials = () => {
    const trpc = useTRPC()
    const [params] = useCredentialsParams();
  return useSuspenseQuery(trpc.Credential.getMany.queryOptions(params));
}

export default useSuspenceCredentials 



export const useCreateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(trpc.Credential.create.mutationOptions ({
    onSuccess: (data) => {
      toast.success(`Credential "${data.name}" created successfully`);
      queryClient.invalidateQueries(
        trpc.Credential.getMany.queryOptions({})
      )
    },
    onError: (error) => {
      toast.error(`Error creating Credential: ${error.message}`);
    }
  }));
}

export const useDeleteCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();


  return useMutation(trpc.Credential.remove.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Credential "${data.name}" deleted successfully`);
      queryClient.invalidateQueries(
        trpc.Credential.getMany.queryOptions({})
      )
      queryClient.invalidateQueries(
        trpc.Credential.getOne.queryFilter({id: data.id})
      )
    },
    onError: (error) => {
      toast.error(`Error deleting Credential: ${error.message}`);
    }
  }));
}  


export const useSuspenceCredential=(id:string)=>{
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.Credential.getOne.queryOptions({id}));
}

export const useUpdateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(trpc.Credential.update.mutationOptions({

    onSuccess: (data) => {
      toast.success(`Credential "${data.name}" updated`);
      queryClient.invalidateQueries(
        trpc.Credential.getMany.queryOptions({})
      )
      queryClient.invalidateQueries(
        trpc.Credential.getOne.queryOptions({id:data.id})
      )
    },
    onError: (error) => {
      toast.error(`failed to save Credential: ${error.message}`);
    }
  }));
}

export const useCredentialsByType = (type:CredentialType)=>{
  const trpc = useTRPC();
  return useQuery(trpc.Credential.getByType.queryOptions({type}))
}