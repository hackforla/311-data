/** @type {import('jest').Config} */
const config = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['./components/**'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  moduleDirectories: [
    'node_modules',
  ],
  moduleNameMapper: {
    '^@root(.*)$': '<rootDir>/$1',
    '^@components(.*)$': '<rootDir>/components/$1',
    '^@reducers(.*)$': '<rootDir>/redux/reducers/$1',
    '^@styles(.*)$': '<rootDir>/styles/$1',
    '^@assets(.*)$': '<rootDir>/assets/$1',
    '^@utils(.*)$': '<rootDir>/utils/$1',
    '^@tests(.*)$': '<rootDir>/__tests__/$1',
    '^.+.(styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$': 'jest-transform-stub',
    '^.+(ReactToastify).css$': 'jest-transform-stub',
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
};

module.exports = config;
