// import { Button } from '@/components/ui/button';
import { caller, getQueryClient, trpc } from '@/trpc/server';
import Client from './Client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

const page = async () => {

  //   const trpc = useTRPC()
  // const {data: users} =  useQuery(trpc.getUsers.queryOptions())
  // const users = await caller.getUsers();
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions())

  return (<>
    <div className='text-red-500 font-bold'>Hello my Word</div>
    {/* <Button>
     {JSON.stringify(users)}
    </Button> */}
    <HydrationBoundary state={dehydrate(queryClient)}>
    <Client/>
    </HydrationBoundary>
    </>
  )
}

export default page


//  git add .
// >> git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/OlawuniTemitope/ai-autoresponder.git
// git push -u origin main
