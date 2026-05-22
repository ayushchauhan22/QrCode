import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { AuthLayout } from '../components/auth/AuthLayout'
import { loginSchema } from '../lib/authSchemas'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPwd, setShowPwd] = useState(false)
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})

        const parsed = loginSchema.safeParse({ email, password })
        if (!parsed.success) {
            const fieldErrors = {}
            for (const issue of parsed.error.issues) {
                const key = issue.path[0]
                if (!fieldErrors[key]) fieldErrors[key] = issue.message
            }
            setErrors(fieldErrors)
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Login failed')
            
            localStorage.setItem('token', data.token)

            toast.success('Welcome back!')
            navigate('/')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue."
            footer={
                <p>
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-slate-700 underline-offset-4 hover:underline">
                        Create one
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <FieldShell label="Email" error={errors.email}>
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 w-full rounded-xl border border-[#e8ecf1] bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                    />
                </FieldShell>

                <FieldShell label="Password" error={errors.password}>
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type={showPwd ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 w-full rounded-xl border border-[#e8ecf1] bg-white pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700">
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </FieldShell>

                <button type="submit" disabled={submitting}
                    className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-400/30 transition-colors duration-200 hover:bg-blue-700 focus:bg-blue-800 active:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:opacity-60">
                    {submitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
                    ) : (
                        <><span>Sign in</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                    )}
                </button>
            </form>
        </AuthLayout>
    )
}

function FieldShell({ label, error, children }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</label>
            <div className="relative">{children}</div>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    )
}