<?php

declare(strict_types=1);

namespace spec\Flagbit\Bundle\CategoryBundle\Connector\ArrayConverter\StandardToFlat;

use Closure;
use Flagbit\Bundle\CategoryBundle\Connector\ArrayConverter\StandardToFlat\CategoryProperty;
use PhpSpec\ObjectBehavior;

use function array_diff;

/**
 * @method convert(array $item, array $options = [])
 */
class CategoryPropertySpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(CategoryProperty::class);
    }

    public function it_flattens_passed_data(): void
    {
        $this->convert([
            'some_property' => [
                'null' => [
                    'data' => 'Some Data',
                    'locale' => 'null',
                ],
            ],
        ])->shouldMatchArray(['some_property' => 'Some Data']);
    }

    public function it_handles_null_in_data(): void
    {
        $this->convert([
            'some_property' => [
                'null' => [
                    'data' => null,
                    'locale' => 'null',
                ],
            ],
        ])->shouldMatchArray(['some_property' => '']);
    }

    public function it_flattens_passed_localized_data(): void
    {
        $this->convert([
            'some_property' => [
                'de_DE' => [
                    'data' => 'Daten',
                    'locale' => 'de_DE',
                ],
                'en_EN' => [
                    'data' => 'Some Data',
                    'locale' => 'en_EN',
                ],
            ],
        ])->shouldMatchArray([
            'some_property-de_DE' => 'Daten',
            'some_property-en_EN' => 'Some Data',
        ]);
    }

    public function it_flattens_passed_mixed_data(): void
    {
        $this->convert([
            'some_property' => [
                'de_DE' => [
                    'data' => 'Daten',
                    'locale' => 'de_DE',
                ],
                'en_EN' => [
                    'data' => 'Some Data',
                    'locale' => 'en_EN',
                ],
            ],
            'some_other_property' => [
                'null' => [
                    'data' => 'Extra Property!',
                    'locale' => 'null',
                ],
            ],
        ])->shouldMatchArray([
            'some_property-de_DE' => 'Daten',
            'some_property-en_EN' => 'Some Data',
            'some_other_property' => 'Extra Property!',
        ]);
    }

    /**
     * @return Closure[]
     */
    public function getMatchers(): array
    {
        return [
            'matchArray' => static function ($subject, $value) {
                return empty(array_diff($subject, $value));
            },
        ];
    }
}
