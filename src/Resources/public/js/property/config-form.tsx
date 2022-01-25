import * as React from 'react';
import ConfigRenderer from './type-config/config-renderer';
import postConfig from './api/post-config';

export type ChangeState = (code: string, isLocalizable: boolean, labels: Labels, config: any) => void;
export type AddNewConfigToState = (code: string, type: string) => void;
export type RemoveConfigFromState = (code: string) => void;
export type Labels = {
    [index: string]: string;
};
export type SingleConfig = {
    isLocalizable: boolean;
    labels: Labels;
    config: any;
    type: string;
};
export type ConfigValuesType = {
    [index: string]: SingleConfig;
};
type StateType = {
    configValues: ConfigValuesType;
};
type Response = { config: ConfigValuesType };

const fetcherRegistry = require('pim/fetcher-registry');
const __ = require('oro/translator');

class ConfigForm extends React.Component {
    state: StateType = {
        configValues: {},
    };

    changed: boolean = false;

    componentDidMount?(): void {
        fetcherRegistry
            .getFetcher('flagbit-category-config')
            .fetch(1)
            .then((response: Response) => {
                this.setState({
                    configValues: Array.isArray(response.config) ? {} : response.config,
                });
            });
    }

    render(): React.ReactNode {
        const onChange: ChangeState = (code: string, isLocalizable: boolean, labels: Labels, config: any) => {
            const state = this.state;

            // TODO Add error handling for unknown code
            const configData: SingleConfig = state.configValues[code];

            configData.isLocalizable = isLocalizable;
            configData.labels = labels;
            configData.config = config;

            state.configValues[code] = configData;

            this.setState(state);
            this.changed = true;
        };
        onChange.bind(this);

        const addNewConfig: AddNewConfigToState = (code: string, type: string) => {
            const state = this.state;

            if (code in state.configValues) {
                return;
            }

            state.configValues[code] = {
                isLocalizable: false,
                labels: { null: '' },
                config: {},
                type: type,
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
                <div className="AknDefault-contentWithColumn" data-drop-zone="column">
                    <div className="AknDefault-thirdColumnContainer">
                        <div className="AknDefault-thirdColumn" data-drop-zone="tree"></div>
                    </div>
                    <div className="AknDefault-contentWithBottom" data-drop-zone="bottom-panel">
                        <div className="AknDefault-mainContent entity-edit-form edit-form">
                            <header className="AknTitleContainer navigation">
                                <div className="AknTitleContainer-line">
                                    <div className="AknTitleContainer-imageContainer" data-drop-zone="main-image">
                                        <img alt="neu" className="AknTitleContainer-image" src="/bundles/pimui/images/info-user.png" />
                                    </div>
                                    <div className="AknTitleContainer-mainContainer">
                                        <div>
                                            <div className="AknTitleContainer-line">
                                                <div className="AknTitleContainer-backLink" data-drop-zone="breadcrumb-back-link"></div>
                                                <div className="AknTitleContainer-breadcrumbs" data-drop-zone="breadcrumbs"></div>
                                                <div className="AknTitleContainer-buttonsContainer">
                                                    <div
                                                        className="AknTitleContainer-userMenuContainer user-menu"
                                                        data-drop-zone="user-menu"
                                                    >
                                                        <div className="AknTitleContainer-userMenu" />
                                                    </div>
                                                    <div
                                                        className="AknTitleContainer-actionsContainer AknButtonList"
                                                        data-drop-zone="buttons"
                                                    >
                                                        {/* ################# Save button ################## */}
                                                        <button className="AknButton AknButton--apply" onClick={onClick}>
                                                            {__('pim_common.save')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="AknTitleContainer-line">
                                                <div className="AknTitleContainer-title" data-drop-zone="title">
                                                    {__('flagbit_category.entity.category_config.plural_label')}
                                                </div>
                                                <div className="AknTitleContainer-state" data-drop-zone="state">
                                                    <div id="entity-updated" style={{ opacity: this.changed ? 100 : 0 }}>
                                                        <span className="AknState">{__('pim_common.entity_updated')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="AknTitleContainer-line">
                                                <div className="AknTitleContainer-context AknButtonList" data-drop-zone="context"></div>
                                            </div>
                                            <div className="AknTitleContainer-line">
                                                <div className="AknTitleContainer-meta AknButtonList" data-drop-zone="meta"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="AknTitleContainer-line">
                                    <div data-drop-zone="navigation" className="AknTitleContainer-navigation"></div>
                                </div>
                            </header>

                            <div data-drop-zone="content" className="content">
                                {/* ################# Rendering ################## */}
                                {configRenderer.render()}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ConfigForm;
