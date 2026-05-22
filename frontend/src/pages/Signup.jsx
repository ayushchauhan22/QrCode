import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { AuthLayout } from '../components/auth/AuthLayout'
import { signupSchema } from '../lib/authSchemas'

const inputCls = 'h-12 w-full rounded-xl border border-[#e8ecf1] bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20'

export default function Signup() {
    const navigate = useNavigate()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPwd, setShowPwd] = useState(false)
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})

        const parsed = signupSchema.safeParse({ fullName, email, password })
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
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: fullName, email, password }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Signup failed')

            toast.success('Account created! Please sign in.')
            navigate('/login')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Get started in less than a minute."
            footer={
                <p>
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-slate-700 underline-offset-4 hover:underline">
                        Sign in
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <FieldShell label="Full name" error={errors.fullName}>
                    <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="text" autoComplete="name" placeholder="Jane Doe"
                        value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
                </FieldShell>

                <FieldShell label="Email" error={errors.email}>
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="email" autoComplete="email" placeholder="you@example.com"
                        value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </FieldShell>

                <FieldShell label="Password" error={errors.password}
                    hint={!errors.password ? 'Must include upper, lower case letters and a number.' : undefined}>
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                        placeholder="At least 8 characters" value={password}
                        onChange={(e) => setPassword(e.target.value)} className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700">
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </FieldShell>

                <button type="submit" disabled={submitting}
                    className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-[#3b82f6] to-[#1e3a8a] text-sm font-semibold text-white shadow-lg shadow-[#3b82f6]/30 transition hover:shadow-[#3b82f6]/50 disabled:opacity-60">
                    {submitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
                    ) : (
                        <><span>Create account</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                    )}
                </button>
            </form>
        </AuthLayout>
    )
}

function FieldShell({ label, error, hint, children }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</label>
            <div className="relative">{children}</div>
            {error ? <p className="text-xs text-red-600">{error}</p>
                : hint ? <p className="text-xs text-slate-400">{hint}</p> : null}
        </div>
    )
}