import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Pega o token do cookie
  const token = request.cookies.get('auth_token')?.value;

  // 2. Pega a URL que o usuário está tentando acessar
  const { pathname } = request.nextUrl;

  // 3. Se não tem token E está tentando acessar a área privada...
  if (!token && pathname.startsWith('/admin')) {
    // ...redireciona para /login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Se TEM token E está tentando acessar o /login...
  if (token && pathname.startsWith('/login')) {
    // ...redireciona para o /admin (já está logado)
    const adminUrl = new URL('/admin', request.url);
    return NextResponse.redirect(adminUrl);
  }

  // 5. Se nenhum dos casos acima, deixa o usuário passar
  return NextResponse.next();
}

// 6. O 'matcher' diz ao Next.js ONDE o middleware deve rodar.
// Ele só vai rodar nas rotas /admin e /login.
export const config = {
  matcher: ['/admin/:path*', '/login'],
};