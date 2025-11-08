// ✅ jest.setup.ts — inicialização global dos testes

import "@testing-library/jest-dom";
import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "util";

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Mock básico para evitar erros com Next.js
(global as any).Request = class MockRequest {
  url: string;
  constructor(url = "http://localhost") {
    this.url = url;
  }
};

(global as any).Response = class MockResponse {
  body: any;
  constructor(body: any) {
    this.body = body;
  }
  static json(data: any) {
    return new MockResponse(JSON.stringify(data));
  }
};
