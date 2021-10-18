define(['react', 'react-dom'], function (
    React, ReactDOM
) {
    return (domContainer) => {
        ReactDOM.render(<input value={'test'} name={'test'} id={'test'} hidden={false} />, domContainer);
    };
});
