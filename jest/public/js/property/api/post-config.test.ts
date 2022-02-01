import postConfig from '../../../../../src/Resources/public/js/property/api/post-config';

jest.mock(
    'pim/router',
    () => ({
        generate: (route: string, params: any) => {
            expect(route).toBe('flagbit_category.internal_api.category_config_post');
            expect(params).toEqual({ identifier: 1 });
        },
    }),
    { virtual: true }
);

// TODO: This needs a better test case because post-config.ts is just glue code.
describe('Config POST method', () => {
    test('post config', () => {
        postConfig.post({});
    });
});
