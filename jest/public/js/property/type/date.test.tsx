import * as React from 'react';
import { shallow } from 'enzyme';
import date from '../../../../../src/Resources/public/js/property/type/date';
import PropertyDto from '../../../../../src/Resources/public/js/property/type/property-dto';

describe('Date property type', () => {
    test('Rendering the value', () => {
        const onChange = jest.fn();

        const config = {
            isLocalizable: false,
            labels: { null: 'label' },
            config: {},
            type: 'date',
        };

        const dateInstance = date();
        const dto = new PropertyDto('2000-01-31', 'code', null, config, onChange);

        const Date = () => dateInstance.render(dto);

        // @ts-ignore
        const renderedView = shallow(<Date />);

        const contentInputField = renderedView.find('input').first();
        expect(contentInputField.props().value).toBe('2000-01-31');
        expect(contentInputField.props().id).toBe('flagbit_id_code_');
    });

    test('Changing the value', () => {
        const onChange = jest.fn();

        const config = {
            isLocalizable: false,
            labels: { null: 'label' },
            config: {},
            type: 'date',
        };

        const dateInstance = date();
        const dto = new PropertyDto('', 'code', null, config, onChange);

        const Date = () => dateInstance.render(dto);

        // @ts-ignore
        const renderedView = shallow(<Date />);

        const contentInputField = renderedView.find('input').first();
        contentInputField.simulate('change', { target: { value: '2000-01-31' } });

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('code');
        expect(onChange.mock.calls[0][1]).toBe(null);
        expect(onChange.mock.calls[0][2]).toBe('2000-01-31');
    });
});
