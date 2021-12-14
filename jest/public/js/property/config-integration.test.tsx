import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ConfigForm from '../../../../src/Resources/public/js/property/config-form';

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

describe('Integration of complete Config form', function () {
    test('Default empty rendering', function () {
        const { container } = renderView();

        //const th = container.getElementsByTagName('th');

        expect(true).toBe(true);
    });
});

function renderView() {
    return render(<ConfigForm />, {});
}
