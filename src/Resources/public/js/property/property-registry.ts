import { Property, PropertyFactory } from './type/property';
import { Config, ConfigFactory } from './type-config/config';

type RegisteredProperty = {
    [code: string]: {
        type: { default: PropertyFactory };
        config: { default: ConfigFactory };
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

    createConfig(type: string): Config {
        return this.moduleConfig[type].config.default();
    }
}

export default new PropertyRegistry(__moduleConfig);
