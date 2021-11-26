import * as React from 'react';
import PropertyDto from './property-dto';

interface Property {
    render(propertyDto: PropertyDto): React.ReactNode;
}

export default Property;
