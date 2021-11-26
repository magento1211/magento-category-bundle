import PropertyForm from './property-form';

define(['react', 'react-dom'], (
    React, ReactDOM
) => {
    return (domContainer, categoryCode: string) => {
        ReactDOM.render(<PropertyForm categoryCode={categoryCode} />, domContainer);
    };
});
