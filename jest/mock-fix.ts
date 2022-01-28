declare var define;
declare var __moduleConfig;

jest.mock('pim/user-context', () => ({
    get: () => 'en_US',
}));
