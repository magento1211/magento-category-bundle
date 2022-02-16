<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Connector\ArrayConverter\FlatToStandard;

use Akeneo\Pim\Enrichment\Component\Category\Connector\ArrayConverter\FlatToStandard\Category;
use Akeneo\Tool\Component\Connector\ArrayConverter\ArrayConverterInterface;

use function array_merge;
use function dd;
use function explode;
use function in_array;

/**
 * Decorator for {@see Category} that cares about category properties.
 *
 * This decorator extends the original {@see Category} array converter and ensures
 * that the custom category property data is processed too. This is achieved by hooking
 * into the original {@see Category::convert()} function.
 *
 * The process is as follows:
 *   - Running the custom field conversion that covers category properties
 *   - Running the original {@see Category::convert()} function
 *   - Merging the original output with the custom output of this decorator
 *   - Return the merged array
 */
class CategoryDecorator implements ArrayConverterInterface
{
    private Category $baseConverter;

    public function __construct(Category $baseConverter)
    {
        $this->baseConverter = $baseConverter;
    }

    /**
     * @param array<string, mixed> $item
     * @param array<string, mixed> $options
     *
     * @return array<string, mixed>
     */
    public function convert(array $item, array $options = []): array
    {
        $originalResult = $this->baseConverter->convert($item, $options);

        $categoryProperties = [];
        $defaultProperties  = ['code', 'label', 'parent'];

        foreach ($item as $fieldName => $field) {
            if ($field === '' || in_array(explode('-', $fieldName)[0], $defaultProperties, true)) {
                continue;
            }

            $propertyName = $this->getPropertyName($fieldName);
            $value        = $this->appendPropertyValue($fieldName, $field);

            $categoryProperties[$propertyName][$value['locale']] = $value;
        }

        return array_merge($originalResult, $categoryProperties);
    }

    /**
     * @phpstan-param mixed $value
     *
     * @return array<string, mixed>
     */
    private function appendPropertyValue(string $fieldName, $value): array
    {
        $locale = explode('-', $fieldName)[1] ?? 'null';

        return ['data' => $value, 'locale' => $locale];
    }

    /**
     * Get the name of the supplied property without localization.
     */
    private function getPropertyName(string $property): string
    {
        return explode('-', $property)[0];
    }
}
