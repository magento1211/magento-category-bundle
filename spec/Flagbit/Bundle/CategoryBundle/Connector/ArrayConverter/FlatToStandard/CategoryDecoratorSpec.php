<?php

declare(strict_types=1);

namespace spec\Flagbit\Bundle\CategoryBundle\Connector\ArrayConverter\FlatToStandard;

use Akeneo\Tool\Component\Connector\ArrayConverter\ArrayConverterInterface;
use Flagbit\Bundle\CategoryBundle\Connector\ArrayConverter\FlatToStandard\CategoryDecorator;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * @method convert(array $item, array $options)
 */
class CategoryDecoratorSpec extends ObjectBehavior
{
    public function let(
        ArrayConverterInterface $baseConverter,
        ParameterBag $propertiesBag
    ): void {
        $this->beConstructedWith($baseConverter, $propertiesBag);
    }

    public function it_is_initializable(): void
    {
        $this->shouldHaveType(CategoryDecorator::class);
    }

    public function it_just_returns_when_missing_code(
        ArrayConverterInterface $baseConverter,
        ParameterBag $propertiesBag
    ): void {
        $baseConverter->convert(['parent' => 'category'], [])
            ->willReturn(['parent' => 'category']);

        $propertiesBag->set(Argument::any(), Argument::any())
            ->shouldNotHaveBeenCalled();

        $this->convert(['parent' => 'category'], [])
            ->shouldReturn(['parent' => 'category']);
    }

    public function it_adds_property_to_parameter_bag(
        ArrayConverterInterface $baseConverter,
        ParameterBag $propertiesBag
    ): void {
        $itemArray = [
            'code' => 'test',
            'parent' => 'category',
            'some_property' => 'a value',
            'localized_property-de_DE' => 'Deutscher Wert',
            'localized_property-en_US' => 'English value',
        ];

        $baseConverter->convert($itemArray, [])
            ->willReturn(['code' => 'test', 'parent' => 'category']);

        $propertiesBag->set('test', [
            'some_property' => [
                'null' => [
                    'data' => 'a value',
                    'locale' => 'null',
                ],
            ],
            'localized_property' => [
                'de_DE' => [
                    'data' => 'Deutscher Wert',
                    'locale' => 'de_DE',
                ],
                'en_US' => [
                    'data' => 'English value',
                    'locale' => 'en_US',
                ],
            ],
        ])
            ->shouldNotHaveBeenCalled();

        $this->convert($itemArray, [])
            ->shouldReturn(['code' => 'test', 'parent' => 'category']);
    }
}
