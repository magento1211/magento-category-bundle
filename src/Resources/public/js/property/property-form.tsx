import * as React from 'react';
import PropertyRenderer from "./type/property-renderer";

type CategoryInfo = {
    categoryCode: string
};

export type ChangeState = (code: string, locale: string, value: any) => void;
export type PropertyValuesType = {
    [index: string]: {
        locale: string|null,
        data: any,
    }[];
};
type StateType = {
    propertyValues: PropertyValuesType
};

class PropertyForm extends React.Component<CategoryInfo> {
    state: StateType = {
        propertyValues: {}
    }

    render(): React.ReactNode {
        const onChange: ChangeState = (code: string, locale: string, value: any) => {
            const state = this.state;

            const propertyData = state.propertyValues[code] || [{locale: locale, data: value}];

            propertyData.forEach(function(element, key) {
                if (element['locale'] === locale) {
                    propertyData[key]['data'] = value;
                }
            });

            state.propertyValues[code] = propertyData;

            this.setState(state);
        };
        onChange.bind(this);

        const propertyRenderer = new PropertyRenderer(onChange, this.state.propertyValues);

        return (
            <React.Fragment>
                {propertyRenderer.render()}
                <input id={'flagbit_category_properties_json'}
                       name={'flagbit_category_properties_json'}
                       hidden={true}
                       readOnly={true}
                       value={JSON.stringify(this.state.propertyValues)}
                />
            </React.Fragment>
        );
    }
}

export default PropertyForm;
