<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Schema;

use Flagbit\Bundle\CategoryBundle\Exception\InvalidFile;
use JsonSchema\Validator;

use function json_decode;
use function json_encode;
use function realpath;
use function sprintf;

use const JSON_THROW_ON_ERROR;

/**
 * @internal
 */
class SchemaValidator
{
    private object $schema;

    public function __construct(string $schemaPath)
    {
        $realpath = realpath(sprintf('%s/%s', __DIR__, $schemaPath));
        if ($realpath === false) {
            throw InvalidFile::fileNotFound($schemaPath);
        }

        $this->schema = (object) ['$ref' => 'file://' . $realpath];
    }

    /**
     * @phpstan-param mixed[] $data
     *
     * @phpstan-return mixed[]
     */
    public function validate(array $data): array
    {
        $dataObject = $this->createObject($data);

        $validator = new Validator();
        $validator->validate($dataObject, $this->schema);

        return $validator->getErrors();
    }

    /**
     * @phpstan-param mixed[] $data
     */
    private function createObject(array $data): object
    {
        return json_decode(json_encode($data, JSON_THROW_ON_ERROR), false);
    }
}
