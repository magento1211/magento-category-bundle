class PropertyDto {
    constructor(
        readonly value: any,
        readonly code: string,
        readonly locale: string|null,
        private readonly onChange: (code: string, locale: string, value: any) => void
    ) {
    }

    createId(): string {
        return 'flagbit_id_'+this.code;
    }

    updateValue(value: any): void {
        this.onChange(this.code, this.locale, value);
    }
}

export default PropertyDto;
