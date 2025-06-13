// middleware.js
import { NextResponse } from 'next/server';

const SECRET_PASSWORD_HASH = process.env.KEY_PASS_HASH;

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Define rutas que serán protegidas (o que contienen rutas protegidas)
  const protectedFolders = ['/main', '/singleVideo']; // NO incluyas '/api' aquí
  
  // Excepciones: Rutas que siempre deben ser accesibles (ej. login API, la página de login en sí)
  const allowedPaths = ['/login', '/api/login']; 

  const isLoginPage = pathname === '/login';
  const isApiLogin = pathname === '/api/login';
  const isRootPath = pathname === '/';

  // Verifica si la ruta actual es una carpeta protegida (incluyendo subrutas)
  const isWithinProtectedFolder = protectedFolders.some(path =>
    pathname.startsWith(path)
  );

  // Determina si la ruta actual DEBERÍA estar protegida
  // Es protegida si es la raíz o si está dentro de una carpeta protegida
  const shouldBeProtected = isRootPath || isWithinProtectedFolder;

  // Obtiene el valor de la cookie 'authenticated'
  const isAuthenticated = req.cookies.get('authenticated')?.value;

  // 1. Si la ruta es una de las permitidas (como /login o /api/login), siempre permite el acceso
  if (allowedPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. Si la ruta debería estar protegida (según 'shouldBeProtected')
  if (shouldBeProtected) {
    // Y el usuario NO está autenticado
    if (isAuthenticated !== 'true') {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// El 'matcher' le dice a Next.js para qué rutas debe ejecutar este middleware
export const config = {
  matcher: [
    '/',                      // Activa el middleware para la ruta raíz exacta
    '/main/:path*',           // Activa el middleware para /main y cualquier subruta
    '/singleVideo/:path*',    // Activa el middleware para /singleVideo y cualquier subruta
    '/api/:login',            // Solo el login API. El resto de /api no está protegido por el middleware de auth
    '/login',                 // Activa el middleware para la página de login
  ],
};