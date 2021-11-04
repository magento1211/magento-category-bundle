import * as React from 'react';
import {ChangeState, PropertyValuesType} from "../property-form";
import Text from "./text";
import PropertyDto from "./property-dto";

class PropertyRenderer {

    constructor(private readonly onChange: ChangeState, private readonly values: PropertyValuesType) {
    }

    render(): React.ReactNode {
        return (
            <React.Fragment>
                {Object.entries(this.values).map((property) => {
                    const code = property[0];
                    const values = property[1];

                    return values.map((propertyValue) => {
                        return new Text().render(new PropertyDto(propertyValue.data, code, propertyValue.locale, this.onChange));
                    });
                })}
            </React.Fragment>
        );
    }
}

export default PropertyRenderer;
