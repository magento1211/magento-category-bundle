module.exports = {
    verbose: true,
    rootDir: './',
    testURL: 'http://localhost/',
    testMatch: ['**/jest/**/*.test.(js|ts|tsx)'],
    moduleNameMapper: {
        'pimui\/(.+)': '<rootDir>/vendor/akeneo/pim-community-dev/src/Akeneo/Platform/Bundle/UIBundle/Resources/public/$1',
        'flagbitcategory\/(.+)': '<rootDir>/src/Resources/public/js/$1'
    },
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    globals: {
        "__moduleConfig": {}
    },
    setupFiles: [
        `<rootDir>/vendor/akeneo/pim-community-dev/tests/front/unit/jest/enzyme.js`,
        `<rootDir>/jest/mock-fix.ts`,
    ],
    collectCoverageFrom: [
        "<rootDir>/src/"
    ],
    coveragePathIgnorePatterns: [
        "<rootDir>/src/config-forms-renderer.tsx",
        "<rootDir>/src/property-forms-renderer.tsx",
    ],
    coverageDirectory: "<rootDir>/build/",
};
