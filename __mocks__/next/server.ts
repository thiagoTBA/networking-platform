// __mocks__/next/server.ts
export const NextResponse = {
  json: (data: any, init?: any) => ({
    data,
    status: init?.status || 200,
    cookies: {
      set: jest.fn(),
      delete: jest.fn(),
    },
  }),
};
