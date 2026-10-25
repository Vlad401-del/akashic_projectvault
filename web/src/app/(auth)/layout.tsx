import { SiteBrand } from "@/components/site-brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[480px] px-5 py-12 sm:py-20">
      <SiteBrand />
      <div className="mt-10 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">{children}</div>
    </div>
  );
}
