import * as React from 'react';
import { mount } from 'enzyme';
import ConfigForm from '../../../../src/Resources/public/js/property/config-form';
import base from '../../../../src/Resources/public/js/property/type-config/base';
import text from '../../../../src/Resources/public/js/property/type/text';

jest.mock(
    'pim/router',
    () => ({
        generate: jest.fn().mockImplementation(() => '/'),
    }),
    { virtual: true }
);

const promise = new Promise((resolve) => {
    resolve({ config: {} });
});
const configFetcher = {
    fetch: () => promise,
};
jest.mock(
    'pim/fetcher-registry',
    () => ({
        getFetcher: jest.fn().mockImplementation(() => configFetcher),
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

describe('Integration of complete Config form', function () {
    test('Default empty rendering', function () {
        const renderedView = renderView();

        const newCodeField = renderedView.find('#new_config_code');
        expect(newCodeField.first().props().value).toBe('');

        const newTypeField = renderedView.find('#new_config_type');
        const options = newTypeField.find('option');
        expect(options.length).toBe(2);
        expect(options.at(0).props().value).toBe('');
        expect(options.at(1).props().value).toBe('text');

        const appendButton = renderedView.find('#append_property_button');
        expect(appendButton.first().text()).toBe('flagbit_category.config.subjoin.button');

        // No other properties should currently be there
        const otherInputs = renderedView.find('input');
        expect(otherInputs.length).toBe(1);
    });

    test('Add new property config', function () {
        const renderedView = renderView();

        const newCodeField = renderedView.find('#new_config_code');
        const newTypeField = renderedView.find('#new_config_type');
        const appendButton = renderedView.find('#append_property_button');

        newCodeField.simulate('change', { target: { value: 'foo' } });
        newTypeField.simulate('change', { target: { value: 'text' } });
        appendButton.simulate('click');

        const code = renderedView.find('#flagbit_id_foo_code');
        expect(code.text()).toBe('foo');

        const labelDe = renderedView.find('#flagbit_id_foo_label_de_DE');
        expect(labelDe.props().value).toBe('');
        expect(labelDe.props().type).toBe('text');
        expect(labelDe.name()).toBe('input');

        const labelUs = renderedView.find('#flagbit_id_foo_label_en_US');
        expect(labelUs.props().value).toBe('');
        expect(labelUs.props().type).toBe('text');
        expect(labelUs.name()).toBe('input');

        const localizable = renderedView.find('#flagbit_id_foo_localizable');
        expect(localizable.props().value).toBe(1);
        expect(localizable.props().type).toBe('checkbox');
        expect(localizable.name()).toBe('input');
    });

    test('Remove property config', function () {
        const renderedView = renderView();

        const newCodeField = renderedView.find('#new_config_code');
        const newTypeField = renderedView.find('#new_config_type');
        const appendButton = renderedView.find('#append_property_button');

        newCodeField.simulate('change', { target: { value: 'foo' } });
        newTypeField.simulate('change', { target: { value: 'text' } });
        appendButton.simulate('click');

        const closeButton = renderedView.find('svg').first();
        closeButton.simulate('click');

        // No other properties should currently be there after the added ones were removed
        const otherInputs = renderedView.find('input');
        expect(otherInputs.length).toBe(1);
    });
});

function renderView() {
    return mount(<ConfigForm />, {});
}
