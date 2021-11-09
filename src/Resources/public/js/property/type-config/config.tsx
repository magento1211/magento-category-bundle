import * as React from 'react';
import ConfigDto from './config-dto';

interface Config {
    render(config: ConfigDto): React.ReactNode
}

export default Config;
