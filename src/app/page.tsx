import { redirect } from 'next/navigation';

export default function RootPage() {
  // For a real app, you'd check auth status here.
  // For now, we redirect all users to the login page.
  redirect('/login');
}
