import * as React from 'react';
import {ChangeState, ConfigValuesType} from "../config-form";

class ConfigRenderer {

    constructor(private readonly onChange: ChangeState, private readonly values: ConfigValuesType) {
    }

    render(): React.ReactNode {
        return (
            <React.Fragment>
                text
            </React.Fragment>
        );
    }
}

export default ConfigRenderer;

/*
                {Object.entries(this.values).map((property) => {
                    const code = property[0];
                    const values = property[1];

                    return values.map((propertyValue) => {
                        return new Text().render(new PropertyDto(propertyValue.data, code, propertyValue.locale, this.onChange));
                    });
                })}
 */
