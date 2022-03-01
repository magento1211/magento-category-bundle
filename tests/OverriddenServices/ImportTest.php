<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Tests\ImportExport;

use Flagbit\Bundle\CategoryBundle\Connector\ArrayConverter\FlatToStandard\CategoryDecorator;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpFoundation\ParameterBag;

class CategoryImportTest extends KernelTestCase
{
    public function testCategoryImport(): void
    {
        $arrayConverter = static::$container->get('pim_connector.array_converter.flat_to_standard.category');
        $parameterBag   = static::$container->get('flagbit.category.properties_bag');

        self::assertInstanceOf(CategoryDecorator::class, $arrayConverter);
        self::assertInstanceOf(ParameterBag::class, $parameterBag);

        $arrayConverter->convert([
            'code' => 'test',
            'label-en_US' => 'Test',
            'label-de_DE' => 'Test',
            'a_property' => 'a value',
            'localized_property-en_US' => 'a value for testing',
            'localized_property-de_DE' => 'Ein Testwert',
        ], []);

        $arrayConverter->convert([
            'code' => 'test2',
            'label-en_US' => 'Test2',
            'label-de_DE' => 'Test2',
            'a_property' => 'a value2',
            'localized_property-en_US' => 'a value for testing2',
            'localized_property-de_DE' => 'Ein Testwert2',
        ], []);

        self::assertEquals(
            [
                'test' => [
                    'a_property' => [
                        'null' => [
                            'data' => 'a value',
                            'locale' => 'null',
                        ],
                    ],
                    'localized_property' => [
                        'en_US' => [
                            'data' => 'a value for testing',
                            'locale' => 'en_US',
                        ],
                        'de_DE' => [
                            'data' => 'Ein Testwert',
                            'locale' => 'de_DE',
                        ],
                    ],
                ],
                'test2' => [
                    'a_property' => [
                        'null' => [
                            'data' => 'a value2',
                            'locale' => 'null',
                        ],
                    ],
                    'localized_property' => [
                        'en_US' => [
                            'data' => 'a value for testing2',
                            'locale' => 'en_US',
                        ],
                        'de_DE' => [
                            'data' => 'Ein Testwert2',
                            'locale' => 'de_DE',
                        ],
                    ],
                ],
            ],
            $parameterBag->all()
        );
    }

    protected function setUp(): void
    {
        self::bootKernel();
    }
}
