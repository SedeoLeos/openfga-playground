import { redirect } from 'next/navigation'

// Root page redirects to the default locale login
export default function RootPage() {
  redirect('/login')
}
