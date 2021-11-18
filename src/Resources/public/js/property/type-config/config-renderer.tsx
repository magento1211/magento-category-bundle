import * as React from 'react';
import {ChangeState, ConfigValuesType, AddNewConfigToState} from "../config-form";
import ConfigDto from "./config-dto";
import Base from "./base";
import ConfigSubjoin from "./config-subjoin";

class ConfigRenderer {

    constructor(private readonly onChange: ChangeState,
                private readonly configs: ConfigValuesType,
                private readonly addNewConfig: AddNewConfigToState) {
    }

    render(): React.ReactNode {
        return (
            <React.Fragment>
                {Object.entries(this.configs).map((property) => {
                    const code = property[0];
                    const configs = property[1];

                    const configDto = new ConfigDto(configs, code, this.onChange);

                    return (<div style={{borderBottom: '1px solid #E8EBEE'}} key={'div_'+code+'_container'}>
                        {new Base().render(configDto)}
                    </div>);
                })}
                <div key={'div_config_subjoin_container'}>
                    <ConfigSubjoin addNewConfig={this.addNewConfig} />
                </div>
            </React.Fragment>
        );
    }
}

export default ConfigRenderer;
