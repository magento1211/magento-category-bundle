import * as React from 'react';
import {ChangeState, ConfigValuesType} from "../config-form";
import ConfigDto from "./config-dto";
import Base from "./base";

class ConfigRenderer {

    constructor(private readonly onChange: ChangeState, private readonly configs: ConfigValuesType) {
    }

    render(): React.ReactNode {
        return (
            <React.Fragment>
                {Object.entries(this.configs).map((property) => {
                    const code = property[0];
                    const configs = property[1];

                    return new Base().render(new ConfigDto(configs, code, this.onChange));
                })}
            </React.Fragment>
        );
    }
}

export default ConfigRenderer;
