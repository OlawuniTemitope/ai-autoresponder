<<<<<<< Updated upstream
import AppSidebar from '@/components/app-sidebar'
=======
import { WorkflowContainer, WorkflowList } from '@/features/workflow/components/workflows'
import { prefetchWorkFlows } from '@/features/workflow/server/prefetch'
>>>>>>> Stashed changes
import { requireAuth } from '@/lib/auth-utils'
import React from 'react'

const page = async () => {
  await requireAuth()
  prefetchWorkFlows()
  return (
   <div></div>
  )
}

export default page