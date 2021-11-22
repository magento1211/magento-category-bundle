import * as React from "react";
import ConfigRenderer from "./type-config/config-renderer";
import postConfig from "./api/post-config";

export type ChangeState = (code: string, is_localizable: boolean, labels: Labels, config: any) => void;
export type AddNewConfigToState = (code: string, type: string) => void;
export type RemoveConfigFromState = (code: string) => void;
export type Labels = {
    [index: string]: string;
};
export type SingleConfig = {
    is_localizable: boolean,
    labels: Labels,
    config: any,
    type: string,
};
export type ConfigValuesType = {
    [index: string]: SingleConfig;
};
type StateType = {
    configValues: ConfigValuesType
};
type Response = { config: ConfigValuesType };

const FetcherRegistry = require('pim/fetcher-registry');
const __ = require('oro/translator');

class ConfigForm extends React.Component {
    state: StateType = {
        configValues: {}
    }

    componentDidMount?(): void {
        FetcherRegistry.getFetcher('flagbit-category-config').fetch(1).then((response: Response) => {
            this.setState({
                configValues: Array.isArray(response.config) ? {} : response.config
            });
        });
    }

    render(): React.ReactNode {
        const onChange: ChangeState = (code: string, is_localizable: boolean, labels: Labels, config: any) => {
            const state = this.state;

            // TODO Add error handling for unknown code
            const configData: SingleConfig = state.configValues[code];

            configData.is_localizable = is_localizable;
            configData.labels = labels;
            configData.config = config;

            state.configValues[code] = configData;

            this.setState(state);
        };
        onChange.bind(this);

        const addNewConfig: AddNewConfigToState = (code: string, type: string) => {
            const state = this.state;

            if (code in state.configValues) {
                return;
            }

            state.configValues[code] = {
                is_localizable: false,
                labels: {null: ''},
                config: {},
                type: type
            };

            this.setState(state);
        };
        addNewConfig.bind(this);

        const deleteConfig: RemoveConfigFromState = (code: string) => {
            const state = this.state;

            delete state.configValues[code];

            this.setState(state);
        };
        deleteConfig.bind(this);

        const onClick = () => {
            const config = this.state.configValues;
            postConfig.post(config);
        };

        const configRenderer = new ConfigRenderer(onChange, this.state.configValues, addNewConfig, deleteConfig);

        return (
            <React.Fragment>
                {configRenderer.render()}
                <input id={'flagbit_category_config_json'}
                       name={'flagbit_category_config_json'}
                       hidden={true}
                       readOnly={true}
                       value={JSON.stringify(this.state.configValues)}
                />
                <button onClick={onClick}>{__('pim_common.save')}</button>
            </React.Fragment>
        );
    }
}

export default ConfigForm;
