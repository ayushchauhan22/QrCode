import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageShell, GlassCard } from '../components/PageShell'
import { authHeaders } from '../lib/api'

const SCANNER_ID = 'qr-reader'
const SCAN_DEBOUNCE_MS = 2500
const TOAST_DURATION = 2500

function extractUserId(decodedText) {
    const trimmed = decodedText.trim()
    return /^[a-f\d]{24}$/i.test(trimmed) ? trimmed : null
}

function showScanToast(type) {
    const opts = { duration: TOAST_DURATION }

    if (type === 'success') {
        toast.success("checked in successfully", opts)
        return
    }
    if (type === 'already_scanned') {
        toast.warning("already scanned", opts)
        return
    }
    toast.error('Invalid QR code', opts)
}

async function destroyScanner(scanner) {
    if (!scanner) return
    try {
        const scanning =
            typeof scanner.isScanning === 'boolean'
                ? scanner.isScanning
                : scanner.getState?.() === 2
        if (scanning) {
            await scanner.stop()
        }
    } catch (error) {
        console.error('Error stopping scanner:', error)
    }
    try {
        scanner.clear()
    } catch (error) {
        console.error('Error clearing scanner:', error)
    }
}


export default function AdminScanner() {
    const scannerRef = useRef(null) //store the scanner instance to stop it on unmount
    const processingRef = useRef(false) // lock to prevent scan at the same time
    const lastScanRef = useRef({ userId: null, at: 0 })
    const [starting, setStarting] = useState(true)
    const [recentScans, setRecentScans] = useState([])

    useEffect(() => {
        let active = true

        async function onScanSuccess(decodedText) {
            const userId = extractUserId(decodedText)
            if (!userId) {
                showScanToast('invalid')
                return
            }

            const now = Date.now()
            if (
                lastScanRef.current.userId === userId &&
                now - lastScanRef.current.at < SCAN_DEBOUNCE_MS
            ) {
                return
            }
            if (processingRef.current) return

            processingRef.current = true
            lastScanRef.current = { userId, at: now }

            try {
                const res = await fetch(`/api/scan/${userId}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: authHeaders(),
                })
                const data = await res.json()

                if (data.status === 'success') {
                    showScanToast('success')
                    setRecentScans((prev) => [
                        {
                            userId,
                            name: data.user?.name,
                            status: 'success',
                            at: new Date().toLocaleTimeString(),
                        },
                        ...prev.slice(0, 9),
                    ])
                } else if (data.status === 'already_scanned') {
                    showScanToast('already_scanned')
                } else {
                    showScanToast('invalid')
                }
            } catch (error) {
                console.error('Error at scan:', error)
                showScanToast('invalid')
            } finally {
                processingRef.current = false
            }
        }

        async function startScanner() {
            await destroyScanner(scannerRef.current)
            scannerRef.current = null

            if (!active) return

            const html5QrCode = new Html5Qrcode(SCANNER_ID)
            scannerRef.current = html5QrCode

            try {
                await html5QrCode.start(
                    { facingMode: 'environment' },
                    { fps: 10, qrbox: { width: 260, height: 260 } },
                    onScanSuccess,
                    () => {},
                )
                setStarting(false)
            } catch (err) {
                if (active) {
                    toast.error(err?.message || 'Could not start camera', {
                        duration: TOAST_DURATION,
                    })
                    setStarting(false)
                }
            }
        }

        startScanner()

        return () => {
            active = false
            destroyScanner(scannerRef.current).finally(() => {
                scannerRef.current = null
            })
        }
    }, [])

    return (
        <PageShell maxWidth="max-w-lg">
            <GlassCard>
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Admin scanner
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Point at QR codes — camera stays open after each scan.
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e8ecf1] bg-white text-slate-600 transition hover:bg-slate-50"
                        aria-label="Back to home"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-[#e8ecf1] bg-slate-900/5">
                    {starting && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                            <Loader2 className="h-8 w-8 animate-spin text-[#3b82f6]" />
                        </div>
                    )}
                    <div
                        id={SCANNER_ID}
                        className="w-full [&_video]:max-h-[320px] [&_video]:w-full [&_video]:rounded-2xl [&_video]:object-cover"
                    />
                </div>

                {recentScans.length > 0 && (
                    <div className="mt-6 space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Recent scans
                        </p>
                        <ul className="max-h-40 space-y-2 overflow-y-auto">
                            {recentScans.map((scan, i) => (
                                <li
                                    key={`${scan.userId}-${scan.at}-${i}`}
                                    className="flex items-center gap-2 rounded-xl border border-[#e8ecf1] bg-slate-50/80 px-3 py-2 text-sm"
                                >
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                    <span className="truncate text-slate-700">
                                        {scan.name || scan.userId}
                                    </span>
                                    <span className="ml-auto shrink-0 text-xs text-slate-400">
                                        {scan.at}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </GlassCard>
        </PageShell>
    )
}
