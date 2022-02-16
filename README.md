# Flagbit CategoryBundle for Akeneo

[![Frontend Tests](https://github.com/flagbit/category-bundle/actions/workflows/frontend-tests.yml/badge.svg?branch=main)](https://github.com/flagbit/category-bundle/actions/workflows/frontend-tests.yml)
[![Backend Tests](https://github.com/flagbit/category-bundle/actions/workflows/backend-tests.yml/badge.svg?branch=main)](https://github.com/flagbit/category-bundle/actions/workflows/backend-tests.yml)
[![PHP Code Analysis + Style](https://github.com/flagbit/category-bundle/actions/workflows/backend-analysis.yml/badge.svg?branch=main)](https://github.com/flagbit/category-bundle/actions/workflows/backend-analysis.yml)
[![Frontend Code Analysis + Style](https://github.com/flagbit/category-bundle/actions/workflows/frontend-analysis.yml/badge.svg?branch=main)](https://github.com/flagbit/category-bundle/actions/workflows/frontend-analysis.yml)
[![codecov](https://codecov.io/gh/flagbit/category-bundle/branch/main/graph/badge.svg?token=6F67B93XA9)](https://codecov.io/gh/flagbit/category-bundle)

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
