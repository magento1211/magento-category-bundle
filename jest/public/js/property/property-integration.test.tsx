import * as React from 'react';
import { mount, shallow } from 'enzyme';
import base from '../../../../src/Resources/public/js/property/type-config/base';
import text from '../../../../src/Resources/public/js/property/type/text';
import PropertyForm from '../../../../src/Resources/public/js/property/property-form';

const promiseConfig = new Promise((resolve) => {
    resolve({
        config: {
            foo: {
                isLocalizable: true,
                labels: {
                    de_DE: 'DE foo',
                    en_US: 'US foo',
                },
                config: {},
                type: 'text',
            },
            bar: {
                isLocalizable: false,
                labels: {
                    de_DE: 'label bar de',
                    en_US: 'label bar us',
                },
                config: {},
                type: 'text',
            },
        },
    });
});
const configFetcher = {
    fetch: () => promiseConfig,
};

const promiseProperty = new Promise((resolve) => {
    resolve({
        properties: {
            foo: {
                de_DE: {
                    locale: 'de_DE',
                    data: 'deutsch',
                },
                en_US: {
                    locale: 'en_US',
                    data: 'english',
                },
            },
            bar: {
                null: {
                    locale: 'null',
                    data: 'regular value',
                },
            },
        },
    });
});
const propertyFetcher = {
    fetch: () => promiseProperty,
};

jest.mock(
    'pim/fetcher-registry',
    () => ({
        getFetcher: jest.fn().mockImplementation((name: string) => {
            if (name === 'flagbit-category-config') {
                return configFetcher;
            }

            if (name === 'flagbit-category-property') {
                return propertyFetcher;
            }
        }),
    }),
    { virtual: true }
);

jest.mock(
    '../../../../src/Resources/public/js/property/locales',
    () => {
        const locales = {
            getEnabledLocales: jest.fn().mockImplementation((isLocalizable: boolean) => (isLocalizable ? ['de_DE', 'en_US'] : ['null'])),
        };

        return {
            FlagbitLocales: {
                locales: locales,
                catalogLocale: 'en_US',
            },
        };
    },
    { virtual: true }
);
jest.mock(
    '../../../../src/Resources/public/js/property/property-registry',
    () => ({
        getOptions: jest.fn().mockImplementation(() => ['text']),
        createConfig: jest.fn().mockImplementation(() => base()),
        createProperty: jest.fn().mockImplementation(() => text()),
    }),
    { virtual: true }
);

describe('Integration of complete Property form', function () {
    test('Rendering hidden input field relevant for saving', async function () {
        const renderedView = mount(<PropertyForm categoryCode={'foo_property_code'} />, {});

        const contentInputField = renderedView.find('#flagbit_category_properties_json');
        expect(contentInputField.name()).toBe('input');
        expect(contentInputField.props().hidden).toBeTruthy();

        const expected =
            '<input id="flagbit_category_properties_json" name="flagbit_category_properties_json" hidden="" readonly="" value="{&quot;foo&quot;:{&quot;de_DE&quot;:{&quot;locale&quot;:&quot;de_DE&quot;,&quot;data&quot;:&quot;deutsch&quot;},&quot;en_US&quot;:{&quot;locale&quot;:&quot;en_US&quot;,&quot;data&quot;:&quot;english&quot;}},&quot;bar&quot;:{&quot;null&quot;:{&quot;locale&quot;:&quot;null&quot;,&quot;data&quot;:&quot;regular value&quot;}}}">';
        await setImmediate(() => {
            // Props don't update, but the changes are in the html visible
            expect(contentInputField.html()).toBe(expected);
        });
    });

    test('Rendering fields by config and properties', async function () {
        const renderedView = shallow(<PropertyForm categoryCode={'foo_property_code'} />, {});

        setImmediate(() => {
            // Input fields
            const inputFields = renderedView.find('input');

            expect(inputFields.get(0).props.value).toBe('deutsch');
            expect(inputFields.get(0).props.id).toBe('flagbit_id_foo_de_DE');
            expect(inputFields.get(0).props.type).toBe('text');

            expect(inputFields.get(1).props.value).toBe('english');
            expect(inputFields.get(1).props.id).toBe('flagbit_id_foo_en_US');
            expect(inputFields.get(1).props.type).toBe('text');

            expect(inputFields.get(2).props.value).toBe('regular value');
            expect(inputFields.get(2).props.id).toBe('flagbit_id_bar_null');
            expect(inputFields.get(2).props.type).toBe('text');

            expect(inputFields.length).toBe(4);

            // Labels
            const labels = renderedView.find('label');

            expect(labels.at(0).text()).toBe('US foo');
            expect(labels.at(1).text()).toBe('de_DE');
            expect(labels.at(2).text()).toBe('en_US');

            expect(labels.at(3).text()).toBe('label bar us');

            expect(labels.length).toBe(4);
        });
    });
});
