import { ChangeState, Labels, SingleConfig } from '../config-form';

class ConfigDto {
    readonly config: any;
    readonly isLocalizable: boolean;
    readonly labels: Labels;

    constructor(private readonly configs: SingleConfig, readonly code: string, private readonly onChange: ChangeState) {
        this.labels = configs.labels;
        this.isLocalizable = configs.isLocalizable;
        this.config = configs.config;
    }

    createId(): string {
        return 'flagbit_id_' + this.code;
    }

    updateConfig(config: any): void {
        this.onChange(this.code, this.isLocalizable, this.labels, config);
    }

    updateLabel(locale: string | null, label: string): void {
        this.labels[locale] = label;

        this.onChange(this.code, this.isLocalizable, this.labels, this.config);
    }

    updateLocalizable(isLocalizable: boolean): void {
        this.onChange(this.code, isLocalizable, this.labels, this.config);
    }
}

export default ConfigDto;
