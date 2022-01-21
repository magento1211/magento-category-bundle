import * as React from 'react';
import { AddNewConfigToState } from '../config-form';
import registry from '../property-registry';
const __ = require('oro/translator');

const codeRegex = /^[a-z0-1_]+$/;
const initState = {
    code: '',
    type: '',
};

type ConfigCreate = {
    addNewConfig: AddNewConfigToState;
};

class ConfigSubjoin extends React.Component<ConfigCreate> {
    state = initState;

    render(): React.ReactNode {
        const baseId = 'new_config';

        return (
            <React.Fragment>
                <div className="AknFormContainer AknFormContainer--withPadding">
                    <div className={'AknFieldContainer'} key={baseId + '_code_container'}>
                        <div className="AknFieldContainer-header">
                            <label htmlFor={baseId + '_code'}>{__('flagbit_category.config.subjoin.code')}</label>
                        </div>
                        <div className="AknFieldContainer-inputContainer field-input">
                            <input
                                id={baseId + '_code'}
                                type={'text'}
                                value={this.state.code}
                                className={'AknTextField'}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                    const state = this.state;
                                    state.code = event.target.value;
                                    this.setState(state);
                                }}
                            />
                        </div>
                    </div>

                    <div className={'AknFieldContainer'} key={baseId + '_type_container'}>
                        <div className="AknFieldContainer-header">
                            <label htmlFor={baseId + '_type'}>{__('flagbit_category.config.subjoin.property_type')}</label>
                        </div>
                        <div className="AknFieldContainer-inputContainer field-input">
                            <select
                                id={baseId + '_type'}
                                value={this.state.type}
                                onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                                    const state = this.state;
                                    state.type = event.target.value;
                                    this.setState(state);
                                }}
                            >
                                <option key={'config_option_default'} value={''}>
                                    {__('flagbit_category.config.subjoin.property_type.default')}
                                </option>
                                {registry.getOptions().map((option) => {
                                    return (
                                        <option key={'config_option_' + option} value={option}>
                                            {__('flagbit_category.property_registry.option.' + option)}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className={'AknFieldContainer'} key={baseId + '_button_container'}>
                        <button
                            id={'append_property_button'}
                            className={'AknButton'}
                            onClick={(): void => {
                                if (!codeRegex.test(this.state.code) || this.state.type === '') {
                                    return;
                                }

                                this.props.addNewConfig(this.state.code, this.state.type);
                                this.setState(initState);
                            }}
                        >
                            {__('flagbit_category.config.subjoin.button')}
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ConfigSubjoin;
