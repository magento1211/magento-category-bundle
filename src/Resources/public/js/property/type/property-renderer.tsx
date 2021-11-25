import * as React from 'react';
import {ChangeState, PropertyValuesType} from "../property-form";
import Text from "./text";
import PropertyDto from "./property-dto";
import {ConfigValuesType} from "../config-form";
import {FlagbitLocales} from '../locales';

class PropertyRenderer {

    constructor(
        private readonly onChange: ChangeState,
        private readonly values: PropertyValuesType,
        private readonly config: ConfigValuesType) {
    }

    render(): React.ReactNode {
        return (
            <React.Fragment>
                {Object.entries(this.config).map((config) => {
                    const code = config[0];
                    const configValues = config[1];
                    const propertyValue = this.values[code];
                    const locales = FlagbitLocales.locales.getEnabledLocales(configValues.is_localizable);

                    const label = <label style={{display: 'block', fontWeight: 900}}>{configValues.labels[FlagbitLocales.catalogLocale] || '['+code+']'}</label>;
                    const hr = <hr />;
                    const property = locales.map((locale) => {
                        const langLabel = configValues.is_localizable ? <label>{locale}</label> : '';
                        const data = propertyValue ? propertyValue[locale].data : '';
                        return [
                            langLabel,
                            new Text().render(new PropertyDto(data, code, locale, configValues, this.onChange))
                        ];
                    });

                    return [label, property, hr];
                })}
            </React.Fragment>
        );
    }
}

export default PropertyRenderer;
