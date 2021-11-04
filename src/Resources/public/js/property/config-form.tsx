import * as React from 'react';
import ConfigRenderer from "./type-config/config-renderer";

export type ChangeState = (code: string, is_localizable: boolean, labels: SingleLabel[], config: any) => void;
type SingleLabel = {locale: string|null, value: string};
type SingleConfig = {
    is_localizable: boolean,
    label: SingleLabel[],
    config: any,
};
export type ConfigValuesType = {
    [index: string]: SingleConfig;
};
type StateType = {
    configValues: ConfigValuesType
};

class ConfigForm extends React.Component {
    state: StateType = {
        configValues: {}
    }

    render(): React.ReactNode {
        const onChange: ChangeState = (code: string, is_localizable: boolean, labels: SingleLabel[], config: any) => {
            const state = this.state;

            const configData: SingleConfig = state.configValues[code] || {
                is_localizable: false,
                label: [{locale: null, value: ''}],
                config: {},
            };

            configData.is_localizable = is_localizable;
            configData.label = labels;
            configData.config = config;

            state.configValues[code] = configData;

            this.setState(state);
        };
        onChange.bind(this);

        const propertyRenderer = new ConfigRenderer(onChange, this.state.configValues);

        return (
            <React.Fragment>
                {propertyRenderer.render()}
                <input id={'flagbit_category_config_json'}
                       name={'flagbit_category_config_json'}
                       hidden={true}
                       readOnly={true}
                       value={JSON.stringify(this.state.configValues)}
                />
            </React.Fragment>
        );
    }
}

export default ConfigForm;
