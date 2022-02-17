<?php

declare(strict_types=1);

namespace spec\Flagbit\Bundle\CategoryBundle\Schema;

use LogicException;
use PhpSpec\ObjectBehavior;

class SchemaValidatorSpec extends ObjectBehavior
{
    public function it_throws_exception_on_invalid_file_path(): void
    {
        $this->shouldThrow(LogicException::class)->during('__construct', ['config.json']);
    }

    public function it_validates_config_schema(): void
    {
        $this->beConstructedWith(__DIR__ . '/../../../../../src/Resources/config/schema/config.json');

        $this->validate($this->getValidConfig())->shouldReturn([]);
    }

    public function it_validates_invalid_config_schema(): void
    {
        $this->beConstructedWith(__DIR__ . '/../../../../../src/Resources/config/schema/config.json');

        foreach ($this->getInvalidConfig() as $invalid) {
            $this->validate($invalid)->shouldNotReturn([]);
        }
    }

    public function it_validates_property_schema(): void
    {
        $this->beConstructedWith(__DIR__ . '/../../../../../src/Resources/config/schema/property.json');

        $this->validate($this->getValidProperties())->shouldReturn([]);
    }

    public function it_validates_invalid_property_schema(): void
    {
        $this->beConstructedWith(__DIR__ . '/../../../../../src/Resources/config/schema/property.json');

        foreach ($this->getInvalidProperties() as $invalid) {
            $this->validate($invalid)->shouldNotReturn([]);
        }
    }

    /**
     * @return mixed[]
     */
    private function getValidConfig(): array
    {
        return [
            'foo' => [
                'config' => [],
                'isLocalizable' => true,
                'labels' => [
                    'de_DE' => 'new label de',
                    'en_US' => 'new label us',
                ],
                'type' => 'text',
            ],
            'bar' => [
                'config' => ['test' => 6],
                'isLocalizable' => false,
                'labels' => ['null' => 'label'],
                'type' => 'foobar',
            ],
        ];
    }

    /**
     * @return mixed[]
     */
    private function getInvalidConfig(): array
    {
        return [
            [
                'foo1' => [
                    'config' => [],
                    'isLocalizable' => true,
                    'labels' => [],
                    'type' => 'text',
                ],
            ],
            [
                'foo2' => [
                    'isLocalizable' => true,
                    'labels' => [
                        'de_DE' => 'new label de',
                        'en_US' => 'new label us',
                    ],
                    'type' => 'text',
                ],
            ],
            [
                'foo3' => [
                    'config' => [],
                    'labels' => [
                        'de_DE' => 'new label de',
                        'en_US' => 'new label us',
                    ],
                    'type' => 'text',
                ],
            ],
            [
                'foo4' => [
                    'config' => [],
                    'isLocalizable' => true,
                    'type' => 'text',
                ],
            ],
            [
                'foo5' => [
                    'config' => [],
                    'isLocalizable' => true,
                    'labels' => [
                        'de_DE' => 'new label de',
                        'en_US' => 'new label us',
                    ],
                ],
            ],
            [
                'foo6' => [
                    'config' => [],
                    'isLocalizable' => 'true',
                    'labels' => ['de_DE' => 'new label de'],
                    'type' => 'text',
                ],
            ],
            [
                'foo7' => [
                    'config' => [],
                    'isLocalizable' => true,
                    'labels' => ['foo' => 'new label de'],
                    'type' => 'text',
                ],
            ],
            [
                'foo7' => [
                    'config' => [],
                    'isLocalizable' => true,
                    'labels' => ['null' => 'new label de'],
                    'type' => 4,
                ],
            ],
        ];
    }

    /**
     * @return mixed[]
     */
    private function getValidProperties(): array
    {
        return [
            'string' => [
                'de_DE' => [
                    'locale' => 'de_DE',
                    'data' => 'deutsch',
                ],
            ],
            'array' => [
                'null' => [
                    'locale' => 'null',
                    'data' => [],
                ],
            ],
            'number' => [
                'en_US' => [
                    'locale' => 'en_US',
                    'data' => 3,
                ],
            ],
            'object' => [
                'en_US' => [
                    'locale' => 'en_US',
                    'data' => ['foo' => 3],
                ],
            ],
            'null' => [
                'en_US' => [
                    'locale' => 'en_US',
                    'data' => null,
                ],
            ],
            'bool' => [
                'en_US' => [
                    'locale' => 'en_US',
                    'data' => true,
                ],
            ],
        ];
    }

    /**
     * @return mixed[]
     */
    private function getInvalidProperties(): array
    {
        return [
            [
                'foo' => [
                    'de_DE' => ['data' => 'deutsch'],
                ],
            ],
            [
                'bar' => [
                    'null' => ['locale' => 'null'],
                ],
            ],
            [
                'baz' => [
                    'en_US' => [
                        'locale' => null,
                        'data' => true,
                    ],
                ],
            ],
            [
                'qux' => [
                    'foo' => [
                        'locale' => 'foo',
                        'data' => true,
                    ],
                ],
            ],
        ];
    }
}
