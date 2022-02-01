<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Serializer\Normalizer;

use Flagbit\Bundle\CategoryBundle\Entity\CategoryConfig;
use Flagbit\Bundle\CategoryBundle\Entity\CategoryProperty;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ObjectNormalizer implements NormalizerInterface
{
    private NormalizerInterface $objectNormalizer;

    public function __construct(NormalizerInterface $objectNormalizer)
    {
        $this->objectNormalizer = $objectNormalizer;
    }

    /**
     * @phpstan-param mixed $data
     * @phpstan-param string|null $format
     *
     * @phpstan-return bool
     */
    public function supportsNormalization($data, $format = null)
    {
        return $data instanceof CategoryConfig || $data instanceof CategoryProperty;
    }

    /**
     * @phpstan-param CategoryConfig|CategoryProperty $object
     * @phpstan-param string|null $format
     * @phpstan-param array<string, mixed> $context
     *
     * @phpstan-return array<string, mixed>
     *
     * @throws ExceptionInterface
     */
    public function normalize($object, $format = null, array $context = [])
    {
        return (array) $this->objectNormalizer->normalize($object, $format, $context);
    }
}
