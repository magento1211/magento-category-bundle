<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Connector\ArrayConverter\FlatToStandard;

use Akeneo\Tool\Component\Connector\ArrayConverter\ArrayConverterInterface;
use Symfony\Component\HttpFoundation\ParameterBag;

use function explode;
use function in_array;

/**
 * Decorator for the category flat to standard array converter that cares about category properties.
 *
 * This decorator extends the original category flat to standard array converter and ensures
 * that the custom category property data is processed too. The processed properties
 * are stored in a {@see ParameterBag} to allow retrieval in other places.
 *
 * The modifications done by this decorator do not affect the converted result
 * of the original category flat to standard array converter in any way.
 */
class CategoryDecorator implements ArrayConverterInterface
{
    private ArrayConverterInterface $baseConverter;
    /** @var ParameterBag<string, array<string, mixed>> */
    private ParameterBag $propertiesBag;

    /**
     * @phpstan-param ParameterBag<string, array<string, mixed>> $propertiesBag
     */
    public function __construct(
        ArrayConverterInterface $baseConverter,
        ParameterBag $propertiesBag
    ) {
        $this->baseConverter = $baseConverter;
        $this->propertiesBag = $propertiesBag;
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
        if (! isset($originalResult['code'])) {
            return $originalResult;
        }

        $this->propertiesBag->set($item['code'], $this->extractCategoryProperties($item));

        return $originalResult;
    }

    /**
     * Extract the custom category properties from the supplied item.
     *
     * The array of properties returned by this function already has the proper
     * format of {@see CategoryProperty::$properties} for further processing.
     *
     * @param array<string, mixed> $item
     *
     * @return array<string, mixed>
     */
    private function extractCategoryProperties(array $item): array
    {
        $categoryProperties = [];
        $defaultProperties  = ['code', 'label', 'parent'];

        foreach ($item as $fieldName => $field) {
            if (in_array($this->getPropertyCode($fieldName), $defaultProperties, true)) {
                continue;
            }

            $propertyName = $this->getPropertyCode($fieldName);
            $value        = $this->createPropertyValue($fieldName, $field);

            $categoryProperties[$propertyName][$value['locale']] = $value;
        }

        return $categoryProperties;
    }

    /**
     * @phpstan-param mixed $value
     *
     * @return array<string, mixed>
     */
    private function createPropertyValue(string $fieldName, $value): array
    {
        $locale = explode('-', $fieldName)[1] ?? 'null';

        return ['data' => $value, 'locale' => $locale];
    }

    /**
     * Get the name of the supplied property without localization.
     */
    private function getPropertyCode(string $property): string
    {
        return explode('-', $property)[0];
    }
}
