import * as React from 'react';
import { mount, shallow } from 'enzyme';
import base from '../../../../src/Resources/public/js/property/type-config/base';
import text from '../../../../src/Resources/public/js/property/type/text';
import PropertyForm from '../../../../src/Resources/public/js/property/property-form';
import { waitFor } from '@testing-library/react';

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
            // Config with missing label and missing property entry
            qux: {
                isLocalizable: false,
                labels: {
                    de_DE: 'Qux de',
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

jest.mock('pim/fetcher-registry', () => ({
    getFetcher: jest.fn().mockImplementation((name: string) => {
        if (name === 'flagbit-category-config') {
            return configFetcher;
        }

        if (name === 'flagbit-category-property') {
            return propertyFetcher;
        }
    }),
}));

jest.mock('../../../../src/Resources/public/js/property/locales', () => {
    const locales = {
        getEnabledLocales: jest.fn().mockImplementation((isLocalizable: boolean) => (isLocalizable ? ['de_DE', 'en_US'] : ['null'])),
    };

    return {
        FlagbitLocales: {
            locales: locales,
            catalogLocale: 'en_US',
        },
    };
});
jest.mock('../../../../src/Resources/public/js/property/property-registry', () => ({
    getOptions: jest.fn().mockImplementation(() => ['text']),
    createConfig: jest.fn().mockImplementation(() => base()),
    createProperty: jest.fn().mockImplementation(() => text()),
}));

describe('Integration of complete Property form', function () {
    test('Rendering hidden input field relevant for saving', async function () {
        const renderedView = await waitFor(() => mount(<PropertyForm categoryCode={'foo_property_code'} />));

        let contentInputField = renderedView.find('#flagbit_category_properties_json');
        expect(contentInputField.name()).toBe('input');
        expect(contentInputField.props().hidden).toBeTruthy();

        const expected = '{"foo":{"de_DE":{"locale":"de_DE","data":"deutsch"}},"bar":{"null":{"locale":"null","data":"regular value"}}}';

        renderedView.update();

        contentInputField = renderedView.find('#flagbit_category_properties_json');
        expect(contentInputField.props().value).toBe(expected);
    });

    test('Rendering fields by config and properties', async function () {
        const renderedView = await waitFor(() => mount(<PropertyForm categoryCode={'foo_property_code'} />));

        renderedView.update();

        // Input fields
        const inputFields = renderedView.find('input');

        expect(inputFields.get(0).props.value).toBe('deutsch');
        expect(inputFields.get(0).props.id).toBe('flagbit_id_foo_de_DE');
        expect(inputFields.get(0).props.type).toBe('text');

        expect(inputFields.get(1).props.value).toBe('');
        expect(inputFields.get(1).props.id).toBe('flagbit_id_foo_en_US');
        expect(inputFields.get(1).props.type).toBe('text');

        expect(inputFields.get(2).props.value).toBe('regular value');
        expect(inputFields.get(2).props.id).toBe('flagbit_id_bar_null');
        expect(inputFields.get(2).props.type).toBe('text');

        // Renders the qux config where the property data was missing
        expect(inputFields.get(3).props.value).toBe('');
        expect(inputFields.get(3).props.id).toBe('flagbit_id_qux_null');
        expect(inputFields.get(3).props.type).toBe('text');

        expect(inputFields.length).toBe(5);

        // Labels
        const labels = renderedView.find('label');

        expect(labels.at(0).text()).toBe('US foo');
        expect(labels.at(1).text()).toBe('de_DE');
        expect(labels.at(2).text()).toBe('en_US');

        expect(labels.at(3).text()).toBe('label bar us');

        // Label text is missing. Use fallback
        expect(labels.at(4).text()).toBe('[qux]');

        expect(labels.length).toBe(5);
    });

    test('Updating fields of properties', async function () {
        const renderedView = await waitFor(() => mount(<PropertyForm categoryCode={'foo_property_code'} />));

        renderedView.update();
        let inputFields = renderedView.find('input');

        inputFields.at(0).simulate('change', { target: { value: 'german' } });
        inputFields.at(2).simulate('change', { target: { value: 'reg val' } });
        // Renders the qux config where the property data was missing
        inputFields.at(3).simulate('change', { target: { value: 'quux' } });

        renderedView.update();
        inputFields = renderedView.find('input');

        expect(inputFields.get(0).props.value).toBe('german');
        expect(inputFields.get(2).props.value).toBe('reg val');
        expect(inputFields.get(3).props.value).toBe('quux');
    });
});
