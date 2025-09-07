import AppHeader from "@/components/app-header";
import BottomNav from "@/components/bottom-nav";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomNav />
    </>
  );
}
