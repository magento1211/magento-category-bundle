# Flagbit CategoryBundle for Akeneo

## Installation

Simply install the package with the following command:

``` bash
composer require flagbit/category_bundle
```

### Enable the bundle

Enable the bundle in the kernel:

``` php
<?php
// config/bundles.php

return [
    // ...
    Flagbit\Bundle\CategoryBundle\FlagbitCategoryBundle::class => ['all' => true],
];
```

### Import the routing

``` yml
# config/routes/flagbit_category.yml
flagbit_category:
    resource: "@FlagbitCategoryBundle/Resources/config/routing.yml"
```

## Compatibility

This extension supports the latest Akeneo PIM CE/EE stable versions:

* 5.0

## Overrides/Additions to Akeneo PIM

These parts might affect the functionality of the bundle after an Akeneo update

* src/Resources/views/CategoryTree/Tab/property.html.twig (also in services.yml)
* src/Resources/config/form_extensions.yml (Adds config to navigation)
