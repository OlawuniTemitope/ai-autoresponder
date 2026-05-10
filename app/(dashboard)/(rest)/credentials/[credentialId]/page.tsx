import { CredentialView } from "@/features/credential/components/credential";
import { CredentialError, CredentialLoading } from "@/features/credential/components/credentials";
import { prefetchCredential } from "@/features/credential/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface PageProps {
    params:  Promise<{
        credentialId:string
    }>
}
const page = async ({params}: PageProps) => {
    const {credentialId} = await params;
    prefetchCredential(credentialId)
  return (
        <div className='p-4 md:px-10 md:py-6 h-full'>
        <div className='mx-auto max-w-3xl w-full flex
        flex-col gap-y-8 h-full'>
          <HydrateClient>
            <ErrorBoundary fallback={<CredentialError/>} >
              <Suspense fallback={<CredentialLoading/>}>
          <CredentialView credentialId={credentialId}/>
              </Suspense>
            </ErrorBoundary>
          </HydrateClient>
          </div>
           </div>
  )
}

export default page
