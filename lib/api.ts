export const BASE_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL || 'https://kaspa-auction-server.vercel.app';

export const apiGet = async <T = any>(path: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.detail?.[0] ?? 'API GET error');
    }
    return (await res.json()) as T;
};

export const apiPost = async <T = any>(path: string, body: any): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.detail?.[0] ?? 'API POST error');
    }
    return (await res.json()) as T;
};
