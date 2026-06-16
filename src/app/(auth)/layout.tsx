import { ReactNode } from "react";
import Link from "next/link";
import { Cpu, ShieldCheck, Truck, Headphones } from "lucide-react";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Hàng chính hãng 100%", color: "bg-emerald-500" },
  { icon: Truck,       label: "Giao hàng toàn quốc",  color: "bg-teal-500"    },
  { icon: Headphones,  label: "Hỗ trợ kỹ thuật 24/7", color: "bg-indigo-500"  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row selection:bg-emerald-500 selection:text-white">

      {/* ── LEFT PANEL — Dark branding ── */}
      <div className="hidden lg:flex lg:w-[42%] bg-stone-950 flex-col relative overflow-hidden border-r border-stone-850">

        {/* Ambient colored blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-emerald-500 opacity-[0.08] blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500 opacity-[0.10] blur-[100px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-teal-500 opacity-[0.06] blur-[80px] -translate-x-1/2 -translate-y-1/2" />

        {/* Colored top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-emerald-500" />

        <div className="relative flex flex-col h-full px-12 py-12 justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Cpu size={20} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight uppercase">SensorX</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">B2B Platform</span>
              </div>
            </div>
          </Link>

          {/* Main content */}
          <div className="py-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-0.5 bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Industrial Automation</span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.15] tracking-tight mb-6">
              Nền tảng<br />
              <span className="text-emerald-400">B2B</span> cho<br />
              doanh nghiệp
            </h2>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm font-light">
              Cung cấp thiết bị cảm biến và tự động hoá công nghiệp chính hãng với bảng giá chiết khấu doanh nghiệp tối ưu nhất.
            </p>
          </div>

          {/* Trust items */}
          <div className="space-y-4">
            {TRUST_ITEMS.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <Icon size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-stone-300 tracking-wide">{label}</span>
              </div>
            ))}
          </div>

          {/* Footer copyright */}
          <p className="text-[10px] text-stone-600 pt-8 border-t border-stone-900 mt-8">
            © {new Date().getFullYear()} SensorX. Bảo mật cấp doanh nghiệp SSL.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form container ── */}
      <div className="flex-1 flex flex-col bg-[#ffffff] dark:bg-stone-950 relative overflow-hidden min-h-screen">
        
        {/* Glow orbs behind right panel */}
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] pointer-events-none" />
 
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 px-4 sm:px-6 py-4 bg-stone-950 border-b border-stone-850">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Cpu size={15} className="text-white" />
          </div>
          <span className="text-base font-black text-white uppercase tracking-tight">SensorX</span>
          <div className="ml-auto px-2 py-0.5 bg-emerald-500 rounded-md">
            <span className="text-[9px] font-black text-white uppercase tracking-widest">B2B</span>
          </div>
        </div>
 
        {/* Form area */}
        <main className="flex-1 flex items-start lg:items-center justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-16 relative z-10">
          <div className="w-full max-w-md bg-[#F9F9FB] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 sm:p-10 rounded-2xl sm:rounded-[2rem] shadow-2xl border-t-4 border-t-[#0D9488]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
