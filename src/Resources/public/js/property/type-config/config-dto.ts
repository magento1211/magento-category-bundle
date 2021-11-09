import {ChangeState, SingleLabel, SingleConfig} from "../config-form";

class ConfigDto {
    readonly config: any;
    readonly is_localizable: boolean;
    readonly labels: SingleLabel[];

    constructor(
        private readonly configs: SingleConfig,
        readonly code: string,
        private readonly onChange: ChangeState
    ) {
        this.labels = configs.labels;
        this.is_localizable = configs.is_localizable;
        this.config = configs.config;
    }

    createId(): string {
        return 'flagbit_id_'+this.code;
    }

    updateConfig(config: any): void {
        this.onChange(this.code, this.is_localizable, this.labels, config);
    }

    updateLabel(locale: string|null, label: string): void {
        this.labels[locale] = label;

        this.labels.forEach((element, key) => {
            if (element.locale === locale) {
                element.value = label;
                this.labels[key] = element;
            }
        });

        this.onChange(this.code, this.is_localizable, this.labels, this.config);
    }

    updateLocalizable(is_localizable: boolean): void {
        this.onChange(this.code, is_localizable, this.labels, this.config);
    }
}

export default ConfigDto;
