
import AppSidebar from '@/components/app-sidebar'

import {SearchParams} from "nuqs/server"
import { WorkflowContainer, WorkFlowError, WorkflowList, WorkFlowLoading } from '@/features/workflow/components/workflows'
import { prefetchWorkFlows } from '@/features/workflow/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import React, { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'
import { workflowsPaaramsLoader } from '@/features/workflow/server/params-loader'

type Props = {
  searchParams: Promise<SearchParams>;
}

const page = async ({searchParams}:Props) => {
  const params = await workflowsPaaramsLoader(searchParams)
  await requireAuth()
  prefetchWorkFlows(params)
  return (
  <WorkflowContainer>
   <HydrateClient>
    <ErrorBoundary fallback={<WorkFlowError/>}>
      <Suspense fallback={<WorkFlowLoading/>}>
      <WorkflowList/>
      </Suspense>
    </ErrorBoundary>
   </HydrateClient>
   </WorkflowContainer>
  )
}

export default page