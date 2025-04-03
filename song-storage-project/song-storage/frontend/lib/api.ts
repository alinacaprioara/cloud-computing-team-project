export async function fetchSongs() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/songs`);
    if (!res.ok) throw new Error('Failed to fetch songs');
    return res.json();
}
