import ConfigForm from './config-form';

define(['react', 'react-dom'], (React, ReactDOM) => {
    return (domContainer) => {
        ReactDOM.render(<ConfigForm />, domContainer);
    };
});
