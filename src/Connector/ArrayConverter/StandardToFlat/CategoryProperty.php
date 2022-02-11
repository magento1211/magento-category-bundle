<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Connector\ArrayConverter\StandardToFlat;

use Akeneo\Tool\Component\Connector\ArrayConverter\StandardToFlat\AbstractSimpleArrayConverter;

use function sprintf;

/**
 * Array converter to flatten the array from {@link CategoryProperty::$properties}.
 */
class CategoryProperty extends AbstractSimpleArrayConverter
{
    /**
     * @param array<string, mixed> $data
     * @phpstan-param array<string, mixed> $convertedItem
     * @phpstan-param array<string, mixed> $options
     *
     * @return array<string, mixed>
     */
    // phpcs:ignore
    protected function convertProperty($property, $data, $convertedItem, $options): array
    {
        foreach ($data as $localizedProperty) {
            $locale = $localizedProperty['locale'];
            $data   = $localizedProperty['data'];

            if (empty($locale) || $locale === 'null') {
                $convertedItem[$property] = $data;

                continue;
            }

            $localizedKey                 = sprintf('%s-%s', $property, $locale);
            $convertedItem[$localizedKey] = $data;
        }

        return $convertedItem;
    }
}
