import AdminPanel from '@/components/AdminPanel'
import { getAuthConfig } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Kennel admin — Del Cani Terezzine', robots: { index: false } }

export default function AdminPage() {
  const { configured, missing } = getAuthConfig()
  return <AdminPanel configured={configured} missing={missing} />
}
