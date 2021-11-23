import {ChangeState} from "../property-form";
import {SingleConfig} from "../config-form";

class PropertyDto {
    constructor(
        readonly value: any,
        readonly code: string,
        readonly locale: string|null,
        readonly config: SingleConfig,
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
