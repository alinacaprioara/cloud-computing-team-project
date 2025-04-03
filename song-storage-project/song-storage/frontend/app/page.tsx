'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`);
            const users = await res.json();

            let user = users.find((u: any) => u.username === username);

            if (!user) {
                const createRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username }),
                });

                if (!createRes.ok) {
                    throw new Error('Failed to create user');
                }

                user = await createRes.json();
            }

            localStorage.setItem('username', username);
            localStorage.setItem('userId', user._id);


            router.push('/home');
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <main className="p-6 max-w-sm mx-auto">
            <h1 className="text-xl font-bold mb-4">Welcome</h1>
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border p-2 mb-4 rounded"
            />
            <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
                Enter
            </button>
        </main>
    );
}
