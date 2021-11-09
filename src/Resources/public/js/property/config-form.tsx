import * as React from 'react';
import ConfigRenderer from "./type-config/config-renderer";

export type ChangeState = (code: string, is_localizable: boolean, labels: SingleLabel[], config: any) => void;
export type SingleLabel = {locale: string|null, value: string};
export type SingleConfig = {
    is_localizable: boolean,
    labels: SingleLabel[],
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
                labels: [{locale: null, value: ''}],
                config: {},
            };

            configData.is_localizable = is_localizable;
            configData.labels = labels;
            configData.config = config;

            state.configValues[code] = configData;

            this.setState(state);
        };
        onChange.bind(this);

        const configRenderer = new ConfigRenderer(onChange, this.state.configValues);

        return (
            <React.Fragment>
                {configRenderer.render()}
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
