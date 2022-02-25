<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Tests\ImportExport;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class CategoryImportTest extends KernelTestCase
{
    protected function setUp(): void
    {
        self::bootKernel();
    }

    public function testCategoryImport() {
        $arrayConverter = static::$container->get('pim_connector.array_converter.flat_to_standard.category');
        $bulkSaveListener = static::$container->get('flagbit.category.event_listener.bulk_save_property');


    }
}
