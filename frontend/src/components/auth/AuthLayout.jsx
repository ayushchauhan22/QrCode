import { Link } from 'react-router-dom'

export function AuthLayout({ title, subtitle, children, footer }) {
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-[#fafbfc] text-slate-900">
            {/* Animated blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 h-112 w-md rounded-full bg-[#3b82f6]/20 blur-[120px] animate-blob" />
                <div className="absolute top-1/3 -right-32 h-104 w-104 rounded-full bg-[#94a3b8]/30 blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-0 left-1/3 h-96 w-[24rem] rounded-full bg-[#3b82f6]/15 blur-[120px] animate-blob" style={{ animationDelay: '4s' }} />
            </div>

            {/* Grid overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
                    backgroundSize: '44px 44px',
                }}
            />

            <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
                {/* Brand panel */}
                <aside className="relative hidden flex-col justify-between p-12 lg:flex">
                    <Link to="/login" className="group relative flex items-center gap-2.5">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] text-base font-bold text-white shadow-lg shadow-[#3b82f6]/30 transition-transform group-hover:scale-105 group-active:scale-95">
                            Q
                        </div>
                        <span className="text-lg font-semibold tracking-tight">QRApp</span>
                    </Link>

                    <div className="max-w-md space-y-6 animate-fade-in">
                        <h2 className="bg-linear-to-br from-slate-900 via-slate-900 to-slate-500 bg-clip-text text-5xl font-semibold leading-[1.05] tracking-tight text-transparent">
                            Scan. Track. Done.
                        </h2>
                        <p className="text-base leading-relaxed text-slate-600">
                            QR-based check-in system. Register, get your QR code, and let admins scan you in instantly.
                        </p>
                    </div>

                    <p className="text-xs text-slate-400">© {new Date().getFullYear()} QRApp. All rights reserved.</p>
                </aside>

                {/* Form panel */}
                <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
                    <div className="w-full max-w-md animate-fade-in-up">
                        <Link to="/login" className="mb-8 flex items-center gap-2.5 lg:hidden">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] text-base font-bold text-white shadow-lg transition-transform active:scale-95">
                                Q
                            </div>
                            <span className="text-lg font-semibold tracking-tight">QRApp</span>
                        </Link>

                        <div className="rounded-3xl border border-[#e8ecf1] bg-white/70 p-8 shadow-xl shadow-slate-900/6 backdrop-blur-xl sm:p-10">
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
                            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
                            <div className="mt-8">{children}</div>
                            {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}