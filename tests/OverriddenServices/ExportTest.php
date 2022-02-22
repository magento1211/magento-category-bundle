<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Tests;

use Flagbit\Bundle\CategoryBundle\Connector\Processor\Normalization\ProcessorDecorator;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ExportTest extends KernelTestCase
{
    protected function setUp(): void
    {
        self::bootKernel();
    }

    public function testProcessorOverride(): void
    {
        $processor = self::$container->get('pim_connector.processor.normalization.category');

        self::assertInstanceOf(ProcessorDecorator::class, $processor);
    }
}
