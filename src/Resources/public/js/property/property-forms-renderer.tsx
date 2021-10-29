import PropertyForm from './property-form';

define(['react', 'react-dom'], function (
    React, ReactDOM
) {
    return (domContainer, categoryCode: string) => {
        ReactDOM.render(<PropertyForm categoryCode={categoryCode} />, domContainer);
    };
});
