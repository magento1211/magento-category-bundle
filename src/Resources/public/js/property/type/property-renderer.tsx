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
        const createEmpty = (isLocalizable: boolean) => {
            return FlagbitLocales.locales.getEnabledLocales(isLocalizable).map((locale) => {
                return {
                    locale: locale,
                    data: ''
                }
            });
        }

        return (
            <React.Fragment>
                {Object.entries(this.config).map((config) => {
                    const code = config[0];
                    const configValues = config[1];
                    const propertyValue = this.values[code] || createEmpty(configValues.is_localizable);

                    const label = <label style={{display: 'block', fontWeight: 900}}>{configValues.labels[FlagbitLocales.catalogLocale] || '['+code+']'}</label>;
                    const hr = <hr />;
                    const property = propertyValue.map((propertyValue) => {
                        const langLabel = configValues.is_localizable ? <label>{propertyValue.locale}</label> : '';
                        return [
                            langLabel,
                            new Text().render(new PropertyDto(propertyValue.data, code, propertyValue.locale, configValues, this.onChange))
                        ];
                    });

                    return [label, property, hr];
                })}
            </React.Fragment>
        );
    }
}

export default PropertyRenderer;
