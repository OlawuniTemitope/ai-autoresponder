import { ExecutionList, ExecutionsError, ExecutionsLoading, ExecutiosContainer } from '@/features/executions/components/executions'
import { executionsParamsLoader } from '@/features/executions/server/params-loader'
import { prefetchExecutions } from '@/features/executions/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import { SearchParams } from 'nuqs'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

type props = {
  searchParams: Promise<SearchParams>
}
const page = async ({searchParams}:props) => {
    await requireAuth();

    const params = await executionsParamsLoader(searchParams);
    prefetchExecutions(params);
  return (
    <ExecutiosContainer>
    <HydrateClient>
      <ErrorBoundary fallback={<ExecutionsError/>}>
        <Suspense fallback={<ExecutionsLoading/>}>
          <ExecutionList/>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
    </ExecutiosContainer>
  )
}

export default page