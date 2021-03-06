import * as React from 'react';
import $ from 'jquery';
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
jest.mock('pim/fetcher-registry', () => ({
    getFetcher: jest.fn().mockImplementation(() => configFetcher),
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

jest.mock('../../../../src/Resources/public/js/property/api/post-config', () => ({
    post: (object) => {
        const expected = {
            foo: {
                config: {},
                isLocalizable: true,
                labels: {
                    de_DE: 'new label de',
                    en_US: 'new label us',
                    null: '',
                },
                type: 'text',
            },
        };

        expect(object).toEqual(expected);

        return $.Deferred().resolve(expected);
    },
}));

describe('Integration of complete Config form', () => {
    test('Default empty rendering', () => {
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

    test('Add new property config', () => {
        const renderedView = renderView();

        addNewConfig(renderedView);

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
        expect(localizable.props().checked).toBe(false);
        expect(localizable.props().type).toBe('checkbox');
        expect(localizable.name()).toBe('input');
    });

    test('Remove property config', () => {
        const renderedView = renderView();

        addNewConfig(renderedView);

        const closeButton = renderedView.find('svg').first();
        closeButton.simulate('click');

        // No other properties should currently be there after the added ones were removed
        const otherInputs = renderedView.find('input');
        expect(otherInputs.length).toBe(1);
    });

    test('Change property config', () => {
        const renderedView = renderView();

        addNewConfig(renderedView);

        let labelDe = renderedView.find('#flagbit_id_foo_label_de_DE');
        labelDe.simulate('change', { target: { value: 'new label de' } });

        let labelUs = renderedView.find('#flagbit_id_foo_label_en_US');
        labelUs.simulate('change', { target: { value: 'new label us' } });

        let localizable = renderedView.find('#flagbit_id_foo_localizable');
        localizable.simulate('change', { target: { checked: true } });

        renderedView.update();
        labelDe = renderedView.find('#flagbit_id_foo_label_de_DE');
        labelUs = renderedView.find('#flagbit_id_foo_label_en_US');
        localizable = renderedView.find('#flagbit_id_foo_localizable');

        expect(labelDe.props().value).toBe('new label de');
        expect(labelUs.props().value).toBe('new label us');
        expect(localizable.props().checked).toBe(true);
    });

    test('Saving config', () => {
        const renderedView = renderView();

        expect(renderedView.find('#entity-updated').props().style.opacity).toBe(0);

        addNewConfig(renderedView);

        expect(renderedView.find('#entity-updated').props().style.opacity).toBe(100);

        const labelDe = renderedView.find('#flagbit_id_foo_label_de_DE');
        labelDe.simulate('change', { target: { value: 'new label de' } });

        const labelUs = renderedView.find('#flagbit_id_foo_label_en_US');
        labelUs.simulate('change', { target: { value: 'new label us' } });

        const localizable = renderedView.find('#flagbit_id_foo_localizable');
        localizable.simulate('change', { target: { checked: true } });

        const saveButton = renderedView.find('button').first();
        saveButton.simulate('click');

        expect(renderedView.find('#entity-updated').props().style.opacity).toBe(0);
    });
});

function renderView() {
    return mount(<ConfigForm />);
}

function addNewConfig(wrapper): void {
    const newCodeField = wrapper.find('#new_config_code');
    const newTypeField = wrapper.find('#new_config_type');
    const appendButton = wrapper.find('#append_property_button');

    newCodeField.simulate('change', { target: { value: 'foo' } });
    newTypeField.simulate('change', { target: { value: 'text' } });
    appendButton.simulate('click');
}
