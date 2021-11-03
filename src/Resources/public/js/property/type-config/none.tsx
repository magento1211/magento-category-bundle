import * as React from 'react';
import Config from './config';

class None implements Config {
    render(): React.ReactNode {
        return (
            <React.Fragment><p>🚫 No configuration available for this attribute</p></React.Fragment>
        );
    }
}

export default None;
