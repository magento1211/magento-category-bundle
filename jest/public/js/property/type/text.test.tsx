import * as React from 'react';
import { shallow } from 'enzyme';
import text from '../../../../../src/Resources/public/js/property/type/text';
import PropertyDto from '../../../../../src/Resources/public/js/property/type/property-dto';

describe('Text property type', () => {
    test('Rendering the value', () => {
        const onChange = jest.fn();

        const config = {
            isLocalizable: false,
            labels: { null: 'label' },
            config: {},
            type: 'text',
        };

        const textInstance = text();
        const dto = new PropertyDto('value', 'code', null, config, onChange);

        const Text = () => textInstance.render(dto);

        // @ts-ignore
        const renderedView = shallow(<Text />);

        const contentInputField = renderedView.find('input').first();
        expect(contentInputField.props().value).toBe('value');
        expect(contentInputField.props().id).toBe('flagbit_id_code_');
    });

    test('Changing the value', () => {
        const onChange = jest.fn();

        const config = {
            isLocalizable: false,
            labels: { null: 'label' },
            config: {},
            type: 'text',
        };

        const textInstance = text();
        const dto = new PropertyDto('value', 'code', null, config, onChange);

        const Text = () => textInstance.render(dto);

        // @ts-ignore
        const renderedView = shallow(<Text />);

        const contentInputField = renderedView.find('input').first();
        contentInputField.simulate('change', { target: { value: 'value2' } });

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('code');
        expect(onChange.mock.calls[0][1]).toBe(null);
        expect(onChange.mock.calls[0][2]).toBe('value2');
    });
});
