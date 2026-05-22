import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { fetchCurrentUser, verifySession } from '../lib/api'

export function AuthRoute({ children, mode }) {
    const [allowed, setAllowed] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        let cancelled = false

        async function check() {
            try {
                const isAuthed = await verifySession()
                if (cancelled) return

                if (mode === 'guest') {
                    if (isAuthed) {
                        navigate('/', { replace: true })
                        return
                    }
                    setAllowed(true)
                    return
                }

                if (!isAuthed) {
                    navigate('/login', { replace: true })
                    return
                }

                if (mode === 'admin') {
                    const user = await fetchCurrentUser()
                    if (cancelled) return
                    if (user?.role === 'admin') {
                        setAllowed(true)
                    } else {
                        toast.error('Admin access required')
                        navigate('/', { replace: true })
                    }
                    return
                }

                setAllowed(true)
            } catch {
                if (cancelled) return
                if (mode === 'guest') {
                    setAllowed(true)
                } else {
                    navigate('/login', { replace: true })
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        check()
        return () => { cancelled = true }
    }, [mode, navigate])

    if (loading) return null
    if (!allowed) return null
    return children
}
