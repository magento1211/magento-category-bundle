import * as React from 'react';

type CategoryInfo = {
    categoryCode: string
};

class PropertyForm extends React.Component<CategoryInfo> {
    state = {
        propertyValues: {}
    }

    render() {
        return (
            <React.Fragment>
                <input id={'flagbit_category_properties_json'} name={'pim_category[flagbit_category_properties_json]'} hidden={true} />
            </React.Fragment>
        );
    }
}

export default PropertyForm;
