import * as React from 'react';
import { ChangeState, PropertyValuesType } from '../property-form';
import PropertyDto from './property-dto';
import { ConfigValuesType } from '../config-form';
import { FlagbitLocales } from '../locales';
import registry from '../property-registry';

class PropertyRenderer {
    constructor(
        private readonly onChange: ChangeState,
        private readonly values: PropertyValuesType,
        private readonly config: ConfigValuesType
    ) {}

    render(): React.ReactNode {
        return (
            <React.Fragment>
                {Object.entries(this.config).map((config) => {
                    const code = config[0];
                    const configValues = config[1];
                    const propertyValue = this.values[code];
                    const locales = FlagbitLocales.locales.getEnabledLocales(configValues.isLocalizable);

                    const label = (
                        <label style={{ display: 'block', fontWeight: 900 }} key={'label_' + code}>
                            {configValues.labels[configValues.isLocalizable ? FlagbitLocales.catalogLocale : 'null'] || '[' + code + ']'}
                        </label>
                    );
                    const hr = <hr key={'hr_' + code} />;
                    const property = locales.map((locale) => {
                        const langLabel = configValues.isLocalizable ? <label key={'label_' + code + '_' + locale}>{locale}</label> : '';
                        const data = propertyValue ? propertyValue[locale].data : '';
                        return [
                            langLabel,
                            registry
                                .createProperty(configValues.type)
                                .render(new PropertyDto(data, code, locale, configValues, this.onChange)),
                        ];
                    });

                    return [label, property, hr];
                })}
            </React.Fragment>
        );
    }
}

export default PropertyRenderer;
