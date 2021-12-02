import * as React from 'react';
import ConfigDto from './config-dto';

export interface Config {
    render(config: ConfigDto): React.ReactNode;
}

export type ConfigFactory = () => Config;
