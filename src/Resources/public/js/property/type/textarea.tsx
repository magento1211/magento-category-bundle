import * as React from 'react';
import { Property, PropertyFactory } from './property';
import PropertyDto from './property-dto';

class TextArea implements Property {
    render(propertyDto: PropertyDto): React.ReactNode {
        return (
            <React.Fragment key={propertyDto.code + propertyDto.locale}>
                <div className="AknFieldContainer-inputContainer field-input">
                    <textarea
                        id={propertyDto.createId()}
                        value={propertyDto.value}
                        className={'AknTextareaField'}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
                            propertyDto.updateValue(event.target.value);
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}

const factory: PropertyFactory = (): Property => new TextArea();

// ts-unused-exports:disable-next-line
export default factory;
