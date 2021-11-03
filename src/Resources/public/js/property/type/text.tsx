import * as React from 'react';
import Property from './property';
import PropertyDto from "./property-dto";

class Text implements Property {
    render(propertyDto: PropertyDto): React.ReactNode {
        return (
            <React.Fragment>
                <input id={propertyDto.createId()}
                    type={'text'}
                    value={propertyDto.value}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                        propertyDto.updateValue(event.target.value);
                    }}
                />
            </React.Fragment>
        );
    }
}

export default Text;
