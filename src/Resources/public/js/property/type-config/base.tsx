import * as React from 'react';
import { Config, ConfigFactory } from './config';
import ConfigDto from './config-dto';
import { FlagbitLocales } from '../locales';
const __ = require('oro/translator');

// ts-unused-exports:disable-next-line
export class Base implements Config {
    render(config: ConfigDto): React.ReactNode {
        const baseId = config.createId();

        return (
            <React.Fragment>
                <div className={'AknFieldContainer'} key={baseId + '_code_container'}>
                    <div className="AknFieldContainer-header">
                        <label htmlFor={baseId + '_code'}>{__('flagbit_category.config.code')}</label>
                    </div>
                    <div className="AknFieldContainer-inputContainer field-input">
                        <div id={baseId + '_code'}>{config.code}</div>
                    </div>
                </div>

                <div className={'AknFieldContainer'} key={baseId + '_type_container'}>
                    <div className="AknFieldContainer-header">
                        <label htmlFor={baseId + '_type'}>{__('flagbit_category.config.type')}</label>
                    </div>
                    <div className="AknFieldContainer-inputContainer field-input">
                        <div id={baseId + '_type'}>{__('flagbit_category.property_registry.option.' + config.type)}</div>
                    </div>
                </div>

                <div className={'AknFieldContainer'} key={baseId + '_localizable_container'}>
                    <div className="AknFieldContainer-header">
                        <label htmlFor={baseId + '_localizable'}>{__('flagbit_category.config.localizable')}</label>
                    </div>
                    <div className="AknFieldContainer-inputContainer field-input">
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
                </div>

                <div className={'AknFieldContainer'} key={baseId + '_labels_container'}>
                    {FlagbitLocales.locales.getEnabledLocales(true).map((locale) => {
                        const label = config.getLabel(locale);

                        return (
                            <React.Fragment key={baseId + '_label_' + locale + '_container'}>
                                <div className="AknFieldContainer-header">
                                    <label className="AknFieldContainer-label" htmlFor={baseId + '_label_' + locale}>
                                        {__('flagbit_category.config.label')} {locale}
                                    </label>
                                </div>
                                <div className="AknFieldContainer-inputContainer field-input">
                                    <input
                                        id={baseId + '_label_' + locale}
                                        type={'text'}
                                        value={label}
                                        className={'AknTextField'}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                            config.updateLabel(locale, event.target.value);
                                        }}
                                    />
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </React.Fragment>
        );
    }
}

const factory: ConfigFactory = (): Config => new Base();

// ts-unused-exports:disable-next-line
export default factory;
