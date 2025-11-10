import { POST, DELETE } from "@/app/api/login/route";

// 👇 Mocka o NextResponse e o comportamento dos cookies
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data: any) => ({
      data,
      cookies: {
        set: jest.fn(),
        delete: jest.fn(),
      },
    })),
  },
}));

const { NextResponse } = jest.requireMock("next/server");

describe("Login API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve criar cookie de autenticação no login", async () => {
    const res = await POST(); // Chama o handler direto
    expect(NextResponse.json).toHaveBeenCalledWith({ success: true });

    // ✅ Aceita qualquer JWT válido (padrão base64 "eyJ...")
    expect(res.cookies.set).toHaveBeenCalledWith(
      "auth_token",
      expect.stringMatching(/^eyJ/),
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 14400,
      }
    );
  });

  test("deve deletar cookie no logout", async () => {
    const res = await DELETE();
    expect(NextResponse.json).toHaveBeenCalledWith({ success: true });
    expect(res.cookies.delete).toHaveBeenCalledWith("auth_token");
  });
});
