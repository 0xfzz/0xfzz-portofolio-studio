import { PageLayout } from '@/components/ui/PageLayout'
import { GitIntegrationManager } from '@/components/git/GitIntegrationManager'

export default function GitIntegrationPage() {
  return (
    <PageLayout 
      title="GitHub Integration" 
      subtitle="DASHBOARD > SETTINGS > GIT INTEGRATION"
      maxWidth="max-w-none"
    >
      <GitIntegrationManager />
    </PageLayout>
  )
}
