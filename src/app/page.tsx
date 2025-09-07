import { redirect } from 'next/navigation';

export default function RootPage() {
  // We now assume that authentication will be handled by a proper auth guard or middleware in a real app.
  // The default page will redirect to login, as unauthenticated users shouldn't see anything else.
  redirect('/login');
}
