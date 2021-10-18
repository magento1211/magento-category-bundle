module.exports = {
    verbose: true,
    rootDir: './',
    testURL: 'http://localhost/',
    testMatch: ['**/jest/**/*.test.(js|ts|tsx)'],
    moduleNameMapper: {
        'pimui\/(.+)': '<rootDir>/vendor/akeneo/pim-community-dev/src/Akeneo/Platform/Bundle/UIBundle/Resources/public/$1'
    },
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    setupFiles: [
        `<rootDir>/vendor/akeneo/pim-community-dev/tests/front/unit/jest/enzyme.js`,
        `<rootDir>/vendor/akeneo/pim-community-dev/src/Akeneo/Platform/Bundle/UIBundle/Resources/public/lib/select2/select2.js`
    ],
};
