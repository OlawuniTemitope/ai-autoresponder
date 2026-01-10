import { WorkflowContainer, WorkflowList } from '@/features/workflow/components/workflows'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import React, { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'

const page = async () => {
  await requireAuth()
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