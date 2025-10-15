// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // 🔒 Rutas que requieren autenticación
  const protectedFolders = ['/main', '/singleVideo', '/home'];

  // 🔹 Obtiene la cookie 'authenticated'
  const isAuthenticated = req.cookies.get('authenticated')?.value;

  // 🔹 1. Redirige usuarios no autenticados si acceden a rutas protegidas
  const isWithinProtectedFolder = protectedFolders.some(path =>
    pathname.startsWith(path)
  );

  if (isWithinProtectedFolder && isAuthenticated !== 'true') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('message', 'login-required');
    return NextResponse.redirect(url);
  }

  // 🔹 2. Redirige usuarios autenticados de la raíz '/' automáticamente a /home
  if (pathname === '/' && isAuthenticated === 'true') {
    const url = req.nextUrl.clone();
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  // 🔹 3. Fallback: cualquier ruta desconocida redirige a '/'
  const knownPaths = ['/', '/main', '/singleVideo', '/home', '/api/login'];
  const isKnownPath = knownPaths.some(path => pathname.startsWith(path));

  if (!isKnownPath) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('message', 'not-found');
    return NextResponse.redirect(url);
  }

  // 🔹 4. Resto de rutas → dejan pasar
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/main/:path*',
    '/singleVideo/:path*',
    '/home/:path*',
    '/api/:login',
    '/',
  ],
};
