import { Property, PropertyFactory } from './type/property';

type RegisteredProperty = {
    [code: string]: {
        type: { default: PropertyFactory };
        config: string;
    };
};

class PropertyRegistry {
    constructor(private readonly moduleConfig: RegisteredProperty) {}

    getOptions(): string[] {
        return Object.keys(this.moduleConfig);
    }

    createProperty(type: string): Property {
        return this.moduleConfig[type].type.default();
    }
}

export default new PropertyRegistry(__moduleConfig);
