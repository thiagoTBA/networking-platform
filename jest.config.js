/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/__tests__"],
  moduleFileExtensions: ["js", "ts", "tsx", "json", "node"],

  // 👇 mapeia os caminhos corretamente
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^proxy$": "<rootDir>/proxy.ts", // ⬅️ se estiver na raiz
    // "^proxy$": "<rootDir>/src/proxy.ts", // ⬅️ se estiver em src/
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
