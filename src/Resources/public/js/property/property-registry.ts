type RegisteredProperty = {
    type: string;
    config: string;
};

class PropertyRegistry {
    constructor(private readonly moduleConfig: RegisteredProperty[]) {}

    getOptions(): string[] {
        return Object.keys(this.moduleConfig);
    }
}

export default new PropertyRegistry(__moduleConfig);
