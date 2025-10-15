'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectPath = searchParams.get('redirect') || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(redirectPath);
    } else {
      setError('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  return (
    <main className="flex justify-center items-center">
      <div className="w-fit loginDiv gap-5 p-10">
        <h1 className="font-bold text-xl">📚 Acceso Restringido</h1>
        <form onSubmit={handleSubmit} className="">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Ingrese contraseña"
            className={`${error ? "error" : ""}`}
          />
          <button type="submit">Acceder</button>
        </form>
      </div>
    </main>
  );
}
