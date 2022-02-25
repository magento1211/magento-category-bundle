<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Tests\Extension;

use PHPUnit\Runner\AfterLastTestHook;
use PHPUnit\Runner\BeforeFirstTestHook;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Current preparation workaround for integration tests. The directory structure and cache needs to be reevaluated.
 * The goal is to have as less custom configuration and files as possible.
 */
final class AkeneoFileStructureExtension implements BeforeFirstTestHook, AfterLastTestHook
{
    private Filesystem $filesystem;

    private string $targetConfigDir;

    private string $targetPublicDir;

    public function __construct()
    {
        $this->filesystem      = new Filesystem();
        $this->targetConfigDir = __DIR__ . '/../../config';
        $this->targetPublicDir = __DIR__ . '/../../public';
    }

    public function executeBeforeFirstTest(): void
    {
        $this->filesystem->mirror(__DIR__ . '/../config', $this->targetConfigDir);
        $this->filesystem->mkdir($this->targetPublicDir);
    }

    public function executeAfterLastTest(): void
    {
        $this->filesystem->remove([$this->targetPublicDir, $this->targetConfigDir]);
    }
}
