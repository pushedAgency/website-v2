import { Suspense } from 'react';
import LoginForm from '@/app/login/LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}