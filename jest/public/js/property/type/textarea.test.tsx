import * as React from 'react';
import { shallow } from 'enzyme';
import textarea from '../../../../../src/Resources/public/js/property/type/textarea';
import PropertyDto from '../../../../../src/Resources/public/js/property/type/property-dto';

describe('TextArea property type', () => {
    test('Rendering the value', () => {
        const onChange = jest.fn();

        const config = {
            isLocalizable: false,
            labels: { null: 'label' },
            config: {},
            type: 'textarea',
        };

        const textInstance = textarea();
        const dto = new PropertyDto('value', 'code', null, config, onChange);

        const TextArea = () => textInstance.render(dto);

        // @ts-ignore
        const renderedView = shallow(<TextArea />);

        const contentInputField = renderedView.find('textarea').first();
        expect(contentInputField.props().value).toBe('value');
        expect(contentInputField.props().id).toBe('flagbit_id_code_');
    });

    test('Changing the value', () => {
        const onChange = jest.fn();

        const config = {
            isLocalizable: false,
            labels: { null: 'label' },
            config: {},
            type: 'textarea',
        };

        const textInstance = textarea();
        const dto = new PropertyDto('value', 'code', null, config, onChange);

        const TextArea = () => textInstance.render(dto);

        // @ts-ignore
        const renderedView = shallow(<TextArea />);

        const contentInputField = renderedView.find('textarea').first();
        contentInputField.simulate('change', { target: { value: 'value2' } });

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('code');
        expect(onChange.mock.calls[0][1]).toBe(null);
        expect(onChange.mock.calls[0][2]).toBe('value2');
    });
});
