import * as React from 'react';
import { shallow } from 'enzyme';
import NewConfig from '../../../../../src/Resources/public/js/property/type-config/new-config';

jest.mock('../../../../../src/Resources/public/js/property/locales', () => {
    const locales = {
        getEnabledLocales: jest.fn().mockImplementation((isLocalizable: boolean) => (isLocalizable ? ['de_DE', 'en_US'] : ['null'])),
    };

    return {
        FlagbitLocales: {
            locales: locales,
            catalogLocale: 'en_US',
            initialize: jest.fn(),
        },
    };
});

const localeConfig = new Promise((resolve) => {
    resolve({});
});
const localeFetcher = {
    fetchActivated: () => localeConfig,
};

jest.mock('pim/fetcher-registry', () => ({
    getFetcher: () => localeFetcher,
}));
jest.mock('../../../../../src/Resources/public/js/property/property-registry', () => ({
    getOptions: jest.fn().mockImplementation(() => ['text']),
    createConfig: jest.fn().mockImplementation(() => (
        <>
            <div>TextType</div>
        </>
    )),
}));

describe('New Config', function () {
    test('Basic rendering', function () {
        const onChange = jest.fn();

        const renderedView = shallow(<NewConfig addNewConfig={onChange} />);

        const codeField = renderedView.find('input#new_config_code');
        expect(codeField.props().value).toBe('');

        const typeSelect = renderedView.find('select#new_config_type');
        expect(typeSelect.props().value).toBe('');

        const options = typeSelect.find('option');
        expect(options.length).toBe(2);
        expect(options.at(0).text()).toBe('flagbit_category.config.subjoin.property_type.default');
        expect(options.at(0).props().value).toBe('');
        expect(options.at(1).text()).toBe('flagbit_category.property_registry.option.text');
        expect(options.at(1).props().value).toBe('text');

        const addButton = renderedView.find('button');
        expect(addButton.text()).toBe('flagbit_category.config.subjoin.button');
    });

    test('No type was selected', function () {
        const onChange = jest.fn();

        const renderedView = shallow(<NewConfig addNewConfig={onChange} />);

        const codeField = renderedView.find('input#new_config_code');
        codeField.simulate('change', { target: { value: 'my_code' } });

        const addButton = renderedView.find('button');
        addButton.simulate('click');

        expect(onChange.mock.calls.length).toBe(0);
    });

    test('No code was added', function () {
        const onChange = jest.fn();

        const renderedView = shallow(<NewConfig addNewConfig={onChange} />);

        const codeField = renderedView.find('input#new_config_code');
        codeField.simulate('change', { target: { value: '' } });

        const typeSelect = renderedView.find('select#new_config_type');
        typeSelect.simulate('change', { target: { value: 'text' } });

        const addButton = renderedView.find('button');
        addButton.simulate('click');

        expect(onChange.mock.calls.length).toBe(0);
    });

    test('Invalid code', function () {
        const onChange = jest.fn();

        const renderedView = shallow(<NewConfig addNewConfig={onChange} />);

        const codeField = renderedView.find('input#new_config_code');
        codeField.simulate('change', { target: { value: 'my-code' } });

        const typeSelect = renderedView.find('select#new_config_type');
        typeSelect.simulate('change', { target: { value: 'text' } });

        const addButton = renderedView.find('button');
        addButton.simulate('click');

        expect(onChange.mock.calls.length).toBe(0);
    });

    test('Add new property config', function () {
        const onChange = jest.fn();

        const renderedView = shallow(<NewConfig addNewConfig={onChange} />);

        const codeField = renderedView.find('input#new_config_code');
        codeField.simulate('change', { target: { value: 'my_code' } });

        const typeSelect = renderedView.find('select#new_config_type');
        typeSelect.simulate('change', { target: { value: 'text' } });

        const addButton = renderedView.find('button');
        addButton.simulate('click');

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('my_code');
        expect(onChange.mock.calls[0][1]).toBe('text');
    });
});
