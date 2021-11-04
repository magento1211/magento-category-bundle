import {ChangeState} from "../property-form";

class PropertyDto {
    constructor(
        readonly value: any,
        readonly code: string,
        readonly locale: string|null,
        private readonly onChange: ChangeState
    ) {
    }

    createId(): string {
        return 'flagbit_id_'+this.code+'_'+(this.locale || '');
    }

    updateValue(value: any): void {
        this.onChange(this.code, this.locale, value);
    }
}

export default PropertyDto;
