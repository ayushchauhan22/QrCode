import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageShell, GlassCard } from '../components/PageShell'
import { LogoutIcon, ScanIcon } from '../components/icons'
import { authHeaders, logout } from '../lib/api'

const iconBtn =
    'flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8ecf1] bg-white/90 text-slate-600 shadow-sm transition hover:border-[#3b82f6]/30 hover:bg-white hover:text-[#3b82f6]'

export default function Home() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [qrCode, setQrCode] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const meRes = await fetch('/api/auth/me', {
                    credentials: 'include',
                    headers: authHeaders(),
                })
                const meData = await meRes.json()
                if (!meRes.ok) throw new Error(meData.message || 'Failed to load profile')

                const userId = meData.user._id
                if (cancelled) return
                setUser(meData.user)

                const qrRes = await fetch(`/api/qrcode/generate/${userId}`, {
                    credentials: 'include',
                    headers: authHeaders(),
                })
                const qrData = await qrRes.json()
                if (!qrRes.ok) throw new Error(qrData.error || 'Failed to load QR code')
                if (cancelled) return
                setQrCode(qrData.qrCode)
            } catch (err) {
                if (!cancelled) toast.error(err.message)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => { cancelled = true }
    }, [])

    const handleLogout = async () => {
        await logout()
        toast.success('Signed out')
        navigate('/login', { replace: true })
    }

    const headerActions = (
        <>
            {user?.role === 'admin' && (
                <Link
                    to="/admin"
                    className={`${iconBtn} bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] text-white hover:text-white hover:border-transparent`}
                    title="Open scanner"
                    aria-label="Open scanner"
                >
                    <ScanIcon className="h-5 w-5" />
                </Link>
            )}
            <button
                type="button"
                onClick={handleLogout}
                className={iconBtn}
                title="Log out"
                aria-label="Log out"
            >
                <LogoutIcon className="h-5 w-5" />
            </button>
        </>
    )

    return (
        <PageShell headerActions={!loading && user ? headerActions : null}>
            <GlassCard className="!p-6 sm:!p-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
                        <Loader2 className="h-8 w-8 animate-spin text-[#3b82f6]" />
                        <p className="text-sm">Loading your profile…</p>
                    </div>
                ) : user ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                {user.name}
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-500">{user.email}</p>
                            {user.role === 'admin' && (
                                <span className="mt-3 inline-block rounded-full bg-[#3b82f6]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1e3a8a]">
                                    Admin
                                </span>
                            )}
                            {user.isScanned && (
                                <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Scanned
                                </div>
                            )}
                        </div>

                        <div className="mx-auto w-fit rounded-2xl border border-[#e8ecf1] bg-white p-3 shadow-inner">
                            {qrCode ? (
                                <img
                                    src={qrCode}
                                    alt="Your QR code"
                                    className="h-48 w-48 sm:h-52 sm:w-52"
                                />
                            ) : (
                                <div className="flex h-48 w-48 items-center justify-center text-sm text-slate-400 sm:h-52 sm:w-52">
                                    QR unavailable
                                </div>
                            )}
                        </div>

                        <p className="text-center text-xs text-slate-400">
                            Show this code at check-in
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-[#e8ecf1] bg-slate-50/80 px-4 py-3 text-left">
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    User ID
                                </p>
                                <p className="mt-1 break-all font-mono text-sm text-slate-700">
                                    {user._id}
                                </p>
                            </div>
                            <div className="rounded-xl border border-[#e8ecf1] bg-slate-50/80 px-4 py-3 text-left">
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Code
                                </p>
                                <p className="mt-1 break-all font-mono text-sm text-slate-700">
                                    {user.code}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="py-12 text-center text-sm text-slate-500">
                        Could not load your account.
                    </p>
                )}
            </GlassCard>
        </PageShell>
    )
}
