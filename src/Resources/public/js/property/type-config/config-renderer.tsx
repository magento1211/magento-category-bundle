import * as React from 'react';
import { ChangeState, ConfigValuesType, AddNewConfigToState, RemoveConfigFromState } from '../config-form';
import ConfigDto from './config-dto';
import Base from './base';
import ConfigSubjoin from './config-subjoin';

const Close = ({ color, ...props }: { color: string } & any = { color: '#67768A' }) => (
    <svg viewBox="0 0 24 24" width="24" height="24" {...props}>
        <g fillRule="nonzero" stroke={color} fill="none" strokeLinecap="round">
            <path d="M4 4l16 16M20 4L4 20" />
        </g>
    </svg>
);

class ConfigRenderer {
    constructor(
        private readonly onChange: ChangeState,
        private readonly configs: ConfigValuesType,
        private readonly addNewConfig: AddNewConfigToState,
        private readonly deleteConfig: RemoveConfigFromState
    ) {}

    render(): React.ReactNode {
        return (
            <React.Fragment>
                {Object.entries(this.configs).map((property) => {
                    const code = property[0];
                    const configs = property[1];

                    const configDto = new ConfigDto(configs, code, this.onChange);

                    return (
                        <div style={{ borderBottom: '1px solid #E8EBEE' }} key={'div_' + code + '_container'}>
                            <Close onClick={() => this.deleteConfig(code)} color="#67768A" className="AknOptionEditor-remove" />
                            {new Base().render(configDto)}
                        </div>
                    );
                })}
                <div key={'div_config_subjoin_container'}>
                    <ConfigSubjoin addNewConfig={this.addNewConfig} />
                </div>
            </React.Fragment>
        );
    }
}

export default ConfigRenderer;
