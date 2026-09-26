/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/Tests"],
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "babel-jest",
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  clearMocks: true,
};
