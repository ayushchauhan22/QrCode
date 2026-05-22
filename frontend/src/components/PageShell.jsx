import { Link } from 'react-router-dom'

export function PageShell({ children, maxWidth = 'max-w-md', headerActions = null }) {
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-[#fafbfc] text-slate-900">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 h-112 w-md rounded-full bg-[#3b82f6]/20 blur-[120px] animate-blob" />
                <div className="absolute top-1/3 -right-32 h-104 w-104 rounded-full bg-[#94a3b8]/30 blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-0 left-1/3 h-96 w-[24rem] rounded-full bg-[#3b82f6]/15 blur-[120px] animate-blob" style={{ animationDelay: '4s' }} />
            </div>

            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
                    backgroundSize: '44px 44px',
                }}
            />

            <div className="relative z-10 flex min-h-screen flex-col items-center px-6 py-8 sm:px-10 sm:py-10">
                <div className={`mb-6 flex w-full ${maxWidth} items-center justify-between gap-4`}>
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] text-base font-bold text-white shadow-lg shadow-[#3b82f6]/30 transition-transform hover:scale-105">
                            Q
                        </div>
                        <span className="text-lg font-semibold tracking-tight">QRApp</span>
                    </Link>
                    {headerActions && (
                        <div className="flex items-center gap-2">{headerActions}</div>
                    )}
                </div>

                <div className={`w-full ${maxWidth} animate-fade-in-up`}>{children}</div>
            </div>
        </main>
    )
}

export function GlassCard({ children, className = '' }) {
    return (
        <div
            className={`rounded-3xl border border-[#e8ecf1] bg-white/70 p-8 shadow-xl shadow-slate-900/6 backdrop-blur-xl sm:p-10 ${className}`}
        >
            {children}
        </div>
    )
}
