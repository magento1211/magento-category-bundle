// import base from '../src/Resources/public/js/property/type-config/base';
// import text from '../src/Resources/public/js/property/type/text';

declare var define;
declare var __moduleConfig;

jest.mock('pim/user-context', () => {});

// jest.mock(
//     '../src/Resources/public/js/property/api/post-config',
//     () => ({
//         post: jest.fn().mockImplementation(() => undefined),
//     }),
//     { virtual: true }
// );

// jest.mock(
//     '../src/Resources/public/js/property/property-registry',
//     () => ({
//         getOptions: jest.fn().mockImplementation(() => ['text']),
//         createConfig: jest.fn().mockImplementation(() => base()),
//         createProperty: jest.fn().mockImplementation(() => text()),
//     }),
//     { virtual: true }
// );
//
// // pim/fetcher-registry
// const configPromise = () => new Promise((resolve) => {
//     resolve({ config: {} });
// });
// const configFetcher = {
//     fetch: () => configPromise(),
// };
//
// const localePromise = () => new Promise((resolve) => {
//     resolve([{ code: 'de_DE' }, { code: 'en_US' }]);
// });
// const localeFetcher = {
//     fetchActivated: () => localePromise(),
// };
//
// jest.mock(
//     'pim/fetcher-registry',
//     () => ({
//         getFetcher: jest.fn().mockImplementation((fetcherName: string) => {
//             return localeFetcher;
//             switch (fetcherName) {
//                 case 'locale':
//                     return localeFetcher;
//                 case 'flagbit-category-config':
//                     return configFetcher;
//             }
//         }),
//     }),
//     { virtual: true }
// );
