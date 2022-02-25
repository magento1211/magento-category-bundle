<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Exception;

use function sprintf;

class InvalidFile extends Exception
{
    public static function fileNotFound(string $path): self
    {
        return new self(sprintf('File %s not found', $path));
    }
}
