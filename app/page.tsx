"use client"
import { Button } from '@/components/ui/button';
import { LogoutButton } from './logout';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const page =   () => {
  const trpc = useTRPC()

  const queryClient = useQueryClient()

  const {data} = useQuery(trpc.getWorkflows.queryOptions())
 const create = useMutation(trpc.createWorkflow.mutationOptions(
  {
    onSuccess: () => {
      toast.success("Job queued successfully")
    }
  }
 ))
  console.log(data)

  return (<>
  <div className='min-h-screen min-w-screen flex
   items-center flex-col gap-y-6 justify-center'>
    Protected
    <div>
    {JSON.stringify(data, null, 2)}
    </div>
    <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create Workflow
      </Button>
    <LogoutButton/>
  </div>
  
    </>
  )
}

export default page


//  git add .
// >> git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/OlawuniTemitope/ai-autoresponder.git
// git push -u origin main
