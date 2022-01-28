import PropertyDto from '../../../../../src/Resources/public/js/property/type/property-dto';

const createConfig = () => ({
    isLocalizable: false,
    labels: { null: 'label' },
    config: {},
    type: 'text',
});

describe('Property data transfer object', function () {
    test('Value properties', function () {
        const config = createConfig();

        const dto = new PropertyDto('value', 'code', null, config, jest.fn());

        expect(dto.value).toBe('value');
        expect(dto.code).toBe('code');
        expect(dto.locale).toBe(null);
        expect(dto.config).toBe(config);

        const dto2 = new PropertyDto('value', 'code', 'de_DE', config, jest.fn());

        expect(dto2.locale).toBe('de_DE');
    });

    test('Create ID', function () {
        const dto = new PropertyDto('value', 'code', 'de_DE', createConfig(), jest.fn());

        expect(dto.createId()).toBe('flagbit_id_code_de_DE');

        const dto2 = new PropertyDto('value', 'code', null, createConfig(), jest.fn());

        expect(dto2.createId()).toBe('flagbit_id_code_');
    });

    test('Update value', function () {
        const onChange = jest.fn();

        const dto = new PropertyDto('value', 'code', 'de_DE', createConfig(), onChange);

        dto.updateValue('foo');

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('code');
        expect(onChange.mock.calls[0][1]).toBe('de_DE');
        expect(onChange.mock.calls[0][2]).toBe('foo');
    });
});
