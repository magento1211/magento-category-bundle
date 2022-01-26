import * as React from 'react';
import { shallow } from 'enzyme';
import base from '../../../../../src/Resources/public/js/property/type-config/base';
import ConfigDto from '../../../../../src/Resources/public/js/property/type-config/config-dto';

jest.mock(
    '../../../../../src/Resources/public/js/property/locales',
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

const config = {
    isLocalizable: true,
    labels: { de_DE: 'label de', en_US: 'label us' },
    config: {},
    type: 'text',
};

describe('Base config', function () {
    test('Basic rendering', function () {
        const onChange = jest.fn();

        const baseInstance = base();
        const dto = new ConfigDto(config, 'code', onChange);

        const Base = () => baseInstance.render(dto);

        // @ts-ignore
        const renderedView = shallow(<Base />);

        const checkbox = renderedView.find('input#flagbit_id_code_localizable');
        expect(checkbox.props().checked).toBe(true);

        const textFields = renderedView.find('input');
        expect(textFields.at(1).props().value).toBe('label de');
        expect(textFields.at(2).props().value).toBe('label us');

        const type = renderedView.find('div#flagbit_id_code_type');
        expect(type.text()).toBe('flagbit_category.property_registry.option.text');

        const code = renderedView.find('div#flagbit_id_code_code');
        expect(code.text()).toBe('code');
    });

    test('Change localizable', function () {
        const onChange = jest.fn();

        const baseInstance = base();
        const dto = new ConfigDto(config, 'code', onChange);

        const Base = () => baseInstance.render(dto);

        // @ts-ignore
        const renderedView = shallow(<Base />);

        const localizableCheckbox = renderedView.find('input#flagbit_id_code_localizable');
        localizableCheckbox.simulate('change', { target: { checked: false }});

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('code');
        expect(onChange.mock.calls[0][1]).toBe(false);
        expect(onChange.mock.calls[0][2]).toEqual({ de_DE: 'label de', en_US: 'label us' });
        expect(onChange.mock.calls[0][3]).toEqual({});
    });

    test('Changing the value of labels', function () {
        const onChange = jest.fn();

        const baseInstance = base();
        const dto = new ConfigDto(config, 'code', onChange);

        const Base = () => baseInstance.render(dto);

        // @ts-ignore
        const renderedView = shallow(<Base />);

        const labelFields = renderedView.find('input');
        labelFields.at(1).simulate('change', { target: { value: 'de' }});

        expect(onChange.mock.calls[0][0]).toBe('code');
        expect(onChange.mock.calls[0][1]).toBe(true);
        expect(onChange.mock.calls[0][2]).toEqual({ de_DE: 'de', en_US: 'label us' });
        expect(onChange.mock.calls[0][3]).toEqual({});

        labelFields.at(2).simulate('change', { target: { value: 'us' }});

        expect(onChange.mock.calls[0][0]).toBe('code');
        expect(onChange.mock.calls[0][1]).toBe(true);
        expect(onChange.mock.calls[0][2]).toEqual({ de_DE: 'de', en_US: 'us' });
        expect(onChange.mock.calls[0][3]).toEqual({});
    });
});
