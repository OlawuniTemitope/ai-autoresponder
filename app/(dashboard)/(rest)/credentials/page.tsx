import { CredentialContainer, CredentialError, CredentialLoading, CredentialsList } from '@/features/credential/components/credentials'
import { credentialParamsLoader } from '@/features/credential/server/params-loader'
import { prefetchCredentials } from '@/features/credential/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import { SearchParams } from 'nuqs'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

type props = {
  searchParams: Promise<SearchParams>
}
const page = async ({searchParams}:props) => {
    await requireAuth();

    const params = await credentialParamsLoader(searchParams);
    prefetchCredentials(params);
  return (
    <CredentialContainer>
    <HydrateClient>
      <ErrorBoundary fallback={<CredentialError/>}>
        <Suspense fallback={<CredentialLoading/>}>
          <CredentialsList/>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
    </CredentialContainer>
  )
}

export default page