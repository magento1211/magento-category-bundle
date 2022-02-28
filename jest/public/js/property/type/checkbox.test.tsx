import * as React from 'react';
import { shallow } from 'enzyme';
import checkbox from '../../../../../src/Resources/public/js/property/type/checkbox';
import PropertyDto from '../../../../../src/Resources/public/js/property/type/property-dto';

describe('Checkbox property type', () => {
    test('Rendering the value', () => {
        const onChange = jest.fn();

        const config = {
            isLocalizable: false,
            labels: { null: 'label' },
            config: {},
            type: 'checkbox',
        };

        const checkboxInstance = checkbox();
        const dto = new PropertyDto(true, 'code', null, config, onChange);

        const Checkbox = () => checkboxInstance.render(dto);

        // @ts-ignore
        const renderedView = shallow(<Checkbox />);

        const contentInputField = renderedView.find('input').first();
        expect(contentInputField.props().checked).toBe(true);
        expect(contentInputField.props().id).toBe('flagbit_id_code_');
    });

    test('Changing the value', () => {
        const onChange = jest.fn();

        const config = {
            isLocalizable: false,
            labels: { null: 'label' },
            config: {},
            type: 'checkbox',
        };

        const checkboxInstance = checkbox();
        const dto = new PropertyDto('', 'code', null, config, onChange);

        const Checkbox = () => checkboxInstance.render(dto);

        // @ts-ignore
        const renderedView = shallow(<Checkbox />);

        const contentInputField = renderedView.find('input').first();
        expect(contentInputField.props().checked).toBe(false);

        contentInputField.simulate('change', { target: { checked: true } });

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('code');
        expect(onChange.mock.calls[0][1]).toBe(null);
        expect(onChange.mock.calls[0][2]).toBe(true);
    });
});
