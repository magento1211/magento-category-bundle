import * as React from 'react';
import { Property, PropertyFactory } from './property';
import PropertyDto from './property-dto';

class Text implements Property {
    render(propertyDto: PropertyDto): React.ReactNode {
        return (
            <React.Fragment>
                <div key={propertyDto.code + propertyDto.locale}>
                    <input
                        id={propertyDto.createId()}
                        type={'text'}
                        value={propertyDto.value}
                        className={'AknTextField'}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                            propertyDto.updateValue(event.target.value);
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}

const factory: PropertyFactory = (): Property => new Text();

export default factory;
