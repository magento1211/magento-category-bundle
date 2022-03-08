## Create custom property types

While the Category Bundle comes with many build-in property types, your project might need one that is too specific to
your use case than it could be added to the Category Bundle. Don't worry, it allows you to create your own property type
that can be used in your project without contributing to the Bundle.

### Frontend

In a minimal case you need to create a new class that implements [Property](https://github.com/flagbit/category-bundle/blob/main/src/Resources/public/js/property/type/property.tsx)
and a factory function type, that can be found in the same file too. Here is an example how such a file can look like in
your bundle:

``` typescript
// Resources/public/js/property/my-property.tsx
import * as React from 'react';
import { Property, PropertyFactory } from './property';
import PropertyDto from './property-dto';

class MyProperty implements Property {
    render(propertyDto: PropertyDto): React.ReactNode {
        return (
            <React.Fragment key={propertyDto.code + propertyDto.locale}>
                <div className="AknFieldContainer-inputContainer field-input">
                    <input
                        id={propertyDto.createId()}
                        type={'text'}
                        value={propertyDto.value}
                        className={'AknTextField'}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                            propertyDto.updateValue(event.target.value);
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}

const factory: PropertyFactory = (): Property => new MyProperty();

export default factory;
```

The implemented `render()` will get an instance of `PropertyDto` which also contains a method to register changes that
occur when you do changes in your custom property on the category page. You can also access:

| Accessor                      | Description                                   |
|-------------------------------|-----------------------------------------------|
| createId(): string            | Creates a unique id for your form element     |
| updateValue(value: any): void | Updates the state for your property value     |
| value                         | Readonly. Accesses the value of your property |
| code                          | Readonly. Accesses the code of your property  |
| locale                        | Readonly. Accesses a current locale that is enabled in Akeneo. If a property is not set as multilanguage, it will return the string `'null'` |
| config                        | Readonly. Accesses the config of your property. There has to be no config by default, which would result in an empty object |

When your property file is ready, you need to register it **in your own bundle** inside a requirejs.yml file.

``` yaml
# Resources/config/requirejs.yml

config:
  config:
    flagbitcategory/js/property/property-registry:
      my_property:
        type: '@vendorcustom/js/property/my-property.tsx'
        config: '@flagbitcategory/js/property/type-config/base.tsx'
```

`@vendorcustom `represents the name of your bundle. In that example the bundle's name would be `Vendor\CustomBundle`.
If you need additional config, you can inject `js/property/type-config/base.tsx` into your own custom config class
and add your own config file to `config:` in the requirejs.yml file. It's implementation is resembling to that of a
property.

TODO: Document the property value transformer usage
