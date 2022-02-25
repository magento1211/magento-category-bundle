<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Exception;

class ValidationFailed extends Exception
{
    public static function invalidPropertyJsonFormat(): self
    {
        return new self('Invalid properties format');
    }
}
