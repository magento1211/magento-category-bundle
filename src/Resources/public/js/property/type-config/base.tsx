import * as React from 'react';
import { Config, ConfigFactory } from './config';
import ConfigDto from './config-dto';
import { FlagbitLocales } from '../locales';

export class Base implements Config {
    render(config: ConfigDto): React.ReactNode {
        const baseId = config.createId();

        return (
            <React.Fragment>
                <div className={'AknFieldContainer'} key={baseId + '_code_container'}>
                    <label htmlFor={baseId + '_code'}>Code</label>
                    <div id={baseId + '_code'}>{config.code}</div>
                </div>

                <div className={'AknFieldContainer'} key={baseId + '_localizable_container'}>
                    <label htmlFor={baseId + '_localizable'}>Localizable</label>
                    <input
                        id={baseId + '_localizable'}
                        type={'checkbox'}
                        value={1}
                        checked={config.isLocalizable}
                        className={'AknTextField'}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                            config.updateLocalizable(event.target.checked);
                        }}
                    />
                </div>

                <div className={'AknFieldContainer'} key={baseId + '_labels_container'}>
                    {FlagbitLocales.locales.getEnabledLocales(true).map((locale) => {
                        const label = config.labels[locale] || '';

                        return (
                            <React.Fragment key={baseId + '_label_' + locale + '_container'}>
                                <label htmlFor={baseId + '_label_' + locale}>Label {locale}</label>
                                <input
                                    id={baseId + '_label_' + locale}
                                    type={'text'}
                                    value={label}
                                    className={'AknTextField'}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                        config.updateLabel(locale, event.target.value);
                                    }}
                                />
                            </React.Fragment>
                        );
                    })}
                </div>
            </React.Fragment>
        );
    }
}

const factory: ConfigFactory = (): Config => new Base();

export default factory;
