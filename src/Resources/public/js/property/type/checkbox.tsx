import * as React from 'react';
import { Property, PropertyFactory } from './property';
import PropertyDto from './property-dto';

class Checkbox implements Property {
    render(propertyDto: PropertyDto): React.ReactNode {
        return (
            <React.Fragment key={propertyDto.code + propertyDto.locale}>
                <div className="AknFieldContainer-inputContainer field-input">
                    <input
                        id={propertyDto.createId()}
                        type={'checkbox'}
                        value="1"
                        className={'AknTextField'}
                        checked={!!propertyDto.value}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                            propertyDto.updateValue(event.target.checked);
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}

const factory: PropertyFactory = (): Property => new Checkbox();

// ts-unused-exports:disable-next-line
export default factory;
