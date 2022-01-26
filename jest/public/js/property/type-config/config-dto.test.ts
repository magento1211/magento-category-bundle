import ConfigDto from '../../../../../src/Resources/public/js/property/type-config/config-dto';

const createConfig = () => ({
    isLocalizable: true,
    labels: { de_DE: 'label de', en_US: 'label us' },
    config: {},
    type: 'text'
});

describe('Property data transfer object', function () {
    test('Value properties', function () {
        const config = createConfig();

        const dto = new ConfigDto(config, 'code', jest.fn());

        expect(dto.code).toBe('code');
        expect(dto.type).toBe('text');
        expect(dto.isLocalizable).toBeTruthy();
        expect(dto.config).toEqual({});
        expect(dto.labels).toEqual({ de_DE: 'label de', en_US: 'label us' });
    });

    test('Create ID', function () {
        const config = createConfig();

        const dto = new ConfigDto(config, 'code', jest.fn());

        expect(dto.createId()).toBe('flagbit_id_code');
    });

    test('Update config', function () {
        const onChange = jest.fn();

        const config = createConfig();

        const dto = new ConfigDto(config, 'code', onChange);

        dto.updateConfig({foo: 'test'});

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('code');
        expect(onChange.mock.calls[0][1]).toBe(true);
        expect(onChange.mock.calls[0][2]).toEqual({ de_DE: 'label de', en_US: 'label us' });
        expect(onChange.mock.calls[0][3]).toEqual({foo: 'test'});
    });

    test('Update Label', function () {
        const onChange = jest.fn();

        const config = createConfig();

        const dto = new ConfigDto(config, 'code', onChange);

        dto.updateLabel('de_DE', 'label');

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('code');
        expect(onChange.mock.calls[0][1]).toBe(true);
        expect(onChange.mock.calls[0][2]).toEqual({ de_DE: 'label', en_US: 'label us' });
        expect(onChange.mock.calls[0][3]).toEqual({});
    });

    test('Update adds Label for new locale', function () {
        const onChange = jest.fn();

        const config = createConfig();

        const dto = new ConfigDto(config, 'code', onChange);

        dto.updateLabel('fr_FR', 'label fr');

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('code');
        expect(onChange.mock.calls[0][1]).toBe(true);
        expect(onChange.mock.calls[0][2]).toEqual({ de_DE: 'label de', en_US: 'label us', fr_FR: 'label fr' });
        expect(onChange.mock.calls[0][3]).toEqual({});
    });

    test('Update localizable', function () {
        const onChange = jest.fn();

        const config = createConfig();

        const dto = new ConfigDto(config, 'code', onChange);

        dto.updateLocalizable(false);

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('code');
        expect(onChange.mock.calls[0][1]).toBe(false);
        expect(onChange.mock.calls[0][2]).toEqual({ de_DE: 'label de', en_US: 'label us' });
        expect(onChange.mock.calls[0][3]).toEqual({});
    });
});
