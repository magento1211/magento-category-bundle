import * as React from 'react';
import Config from './config';
import ConfigDto from './config-dto';

class Base implements Config {
    render(config: ConfigDto): React.ReactNode {
        const baseId = config.createId();

        return (
            <React.Fragment>
                <div className={'AknFieldContainer'} key={baseId+'_code_container'}>
                    <label htmlFor={baseId+'_code'}>Code</label>
                    <div id={baseId+'_code'}>{config.code}</div>
                </div>

                <div className={'AknFieldContainer'} key={baseId+'_localizable_container'}>
                    <label htmlFor={baseId+'_localizable'}>Localizable</label>
                    <input id={baseId+'_localizable'}
                           type={'checkbox'}
                           value={1}
                           checked={config.is_localizable}
                           className={'AknTextField'}
                           onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                               config.updateLocalizable(event.target.checked);
                           }}
                    />
                </div>

                <div className={'AknFieldContainer'} key={baseId+'_labels_container'}>
                    {Object.entries(config.labels).map((labelConfig) => {
                        const locale = labelConfig[0];
                        const label = labelConfig[1];

                        return (<React.Fragment key={baseId+'_label_'+locale+'_container'}>
                            <label htmlFor={baseId+'_label_'+locale}>Label ({locale})</label>
                            <input id={baseId+'_label_'+locale}
                                   type={'text'}
                                   value={label}
                                   className={'AknTextField'}
                                   onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                       config.updateLabel(locale, event.target.value);
                                   }}
                            />
                        </React.Fragment>);
                    })}
                </div>

            </React.Fragment>
        );
    }
}

export default Base;
