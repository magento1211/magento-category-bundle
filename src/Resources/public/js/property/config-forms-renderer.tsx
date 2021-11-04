import ConfigForm from './config-form';

define(['react', 'react-dom'], function (
    React, ReactDOM
) {
    return (domContainer) => {
        ReactDOM.render(<ConfigForm />, domContainer);
    };
});
