import { proxy } from "proxy";
import { NextResponse } from "next/server";

// Mock do NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    redirect: jest.fn((url: string) => ({ redirectUrl: url })),
    next: jest.fn(() => ({ ok: true })),
  },
}));

describe("Proxy (autenticação e redirecionamento)", () => {
  const mockRequest = (pathname: string, cookie?: string) => ({
    nextUrl: { pathname },
    cookies: {
      get: jest.fn().mockReturnValue(cookie ? { value: cookie } : undefined),
    },
    url: "http://localhost:3000" + pathname,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("🚫 Deve redirecionar /admin → /login se não houver token", () => {
    const req = mockRequest("/admin");
    const res: any = proxy(req as any);
    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(res.redirectUrl.toString()).toContain("/login");
  });

  test("✅ Deve permitir /admin com token", () => {
    const req = mockRequest("/admin", "auth_token");
    const res: any = proxy(req as any);
    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.ok).toBe(true);
  });

  test("🔁 Deve redirecionar /login → /admin se já estiver logado", () => {
    const req = mockRequest("/login", "auth_token");
    const res: any = proxy(req as any);
    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(res.redirectUrl.toString()).toContain("/admin");
  });
});
