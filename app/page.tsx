import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { requireAuth } from '@/lib/auth-utils';
import { caller } from '@/trpc/server';
import { LogoutButton } from './logout';

const page =  async () => {

  await requireAuth();

  const data = await caller.getUsers()

  return (<>
  <div className='min-h-screen min-w-screen flex
   items-center justify-center'>
    Protected
    {JSON.stringify(data)}
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
