import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server';

// Danh sách các đường dẫn hợp lệ
const validPaths = [
  '/',
  '/about',
  '/new',
  '/review',
  '/faq',
  '/contact',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/email-verified',
  '/register-success',
  '/cart',
  '/user',
  '/order',
  '/search',
  '/brand/:path*',
  '/product/:path*',
  '/category/:path*',
  '/favorite',
  '/order-confirm',
  '/checkout',
  '/not-found',
  '/unauthorized',
  '/register-admin',
  '/dashboard',
  '/dashboard/:path*',

  
];

// Các prefix cho route động
const validPrefixes = [
  '/iphone-',
  '/ipad-',
  '/watch-',
  '/mac-',
  '/airpods-',
  '/chinh-sach-',
  '/huong-dan-',
  '/user/',
  '/dashboard/'
];

function middleware(req) {
  const pathname = req.nextUrl.pathname;
  
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/social') ||
    pathname.startsWith('/icons')
  ) {
    return NextResponse.next();
  }

  // Kiểm tra đường dẫn brand động
  if (pathname.startsWith('/brand/')) {
    return NextResponse.next();
  }
  // Kiểm tra đường dẫn product động
  if (pathname.startsWith('/product/')) {
    return NextResponse.next();
  }
  // Kiểm tra đường dẫn category động
  if (pathname.startsWith('/category/')) {
    return NextResponse.next();
  }
  // Kiểm tra đường dẫn category động
  if (pathname.startsWith('/dashboard/')) {
    return NextResponse.next();
  }


  if (!validPaths.includes(pathname) && 
      !validPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.redirect(new URL('/not-found', req.url))
  }

  return NextResponse.next();
}

export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      if (req.nextUrl.pathname.startsWith("/profile")) {
        return !!token;
      }
      return true;
    }
  },
  pages: {
    signIn: '/login',
    error: '/unauthorized'
  }
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/((?!_next|api|static|images|icons|login|register|forgot-password|reset-password|unauthorized|not-found).*)"
  ]
};
