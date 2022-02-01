import { FlagbitLocales } from '../../../../src/Resources/public/js/property/locales';

jest.mock('pim/fetcher-registry', () => ({
    getFetcher: () => ({
        fetchActivated: () =>
            Promise.resolve([
                {
                    code: 'de_DE',
                },
                {
                    code: 'en_US',
                },
            ]),
    }),
}));

describe('Locales', () => {
    test('Get enabled locales', () => {
        expect(FlagbitLocales.locales.getEnabledLocales(true)).toEqual(['de_DE', 'en_US']);
        expect(FlagbitLocales.locales.getEnabledLocales(false)).toEqual(['null']);
    });

    test('Catalog locale', () => {
        expect(FlagbitLocales.catalogLocale).toEqual('en_US');
    });
});
