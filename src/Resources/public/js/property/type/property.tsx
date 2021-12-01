import * as React from 'react';
import PropertyDto from './property-dto';

export interface Property {
    render(propertyDto: PropertyDto): React.ReactNode;
}

export type PropertyFactory = () => Property;
