<<<<<<< HEAD
<<<<<<< Updated upstream
import AppSidebar from '@/components/app-sidebar'
=======
import { WorkflowContainer, WorkflowList } from '@/features/workflow/components/workflows'
import { prefetchWorkFlows } from '@/features/workflow/server/prefetch'
>>>>>>> Stashed changes
=======
import { WorkflowContainer, WorkflowList } from '@/features/workflow/components/workflows'
>>>>>>> 6846ae5742677ad2e618a0197cc5ef75b54ebc72
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import React, { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'

const page = async () => {
  await requireAuth()
  prefetchWorkFlows()
  return (
  <WorkflowContainer>
   <HydrateClient>
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
      <Suspense fallback={<div>Loading...</div>}>
      <WorkflowList/>
      </Suspense>
    </ErrorBoundary>
   </HydrateClient>
   </WorkflowContainer>
  )
}

export default page