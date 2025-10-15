// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // 🔒 Rutas que requieren autenticación
  const protectedFolders = ['/main', '/singleVideo', '/home'];
  
  // 🟢 Rutas accesibles sin autenticación
  const allowedPaths = ['/login', '/api/login'];

  // Verifica si la ruta está dentro de una carpeta protegida
  const isWithinProtectedFolder = protectedFolders.some(path =>
    pathname.startsWith(path)
  );

  // Determina si la ruta debería estar protegida
  const shouldBeProtected = isWithinProtectedFolder;

  // Obtiene la cookie 'authenticated'
  const isAuthenticated = req.cookies.get('authenticated')?.value;

  // Si la ruta está en la lista de permitidas, se deja pasar
  if (allowedPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Si la ruta debería estar protegida y no está autenticado, redirige al login
  if (shouldBeProtected && isAuthenticated !== 'true') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Deja pasar todas las demás rutas (como la landing pública '/')
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/main/:path*',         // Protege /main y subrutas
    '/singleVideo/:path*',  // Protege /singleVideo y subrutas
    '/home/:path*',         // 🔒 Nueva carpeta protegida
    '/api/:login',          // Permite la API de login
    '/login',               // Ejecuta también en la página de login
  ],
};
