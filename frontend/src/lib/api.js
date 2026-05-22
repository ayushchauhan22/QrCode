export function authHeaders(extra = {}) {
    const token = localStorage.getItem('token')
    return {
        ...extra,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
}

export async function verifySession() {
    const res = await fetch('/api/auth/verify', {
        credentials: 'include',
        headers: authHeaders(),
    })
    return res.ok
}

export async function fetchCurrentUser() {
    const res = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: authHeaders(),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.user ?? null
}

export async function logout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: authHeaders(),
        })
    } finally {
        localStorage.removeItem('token')
    }
}
