<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Connector\Processor\Normalization;

use Akeneo\Pim\Enrichment\Component\Category\Model\CategoryInterface;
use Akeneo\Tool\Component\Batch\Item\InvalidItemException;
use Akeneo\Tool\Component\Batch\Item\ItemProcessorInterface;
use Akeneo\Tool\Component\Connector\Processor\Normalization\Processor;
use Flagbit\Bundle\CategoryBundle\Connector\ArrayConverter\StandardToFlat\CategoryProperty as StandardToFlatConverter;
use Flagbit\Bundle\CategoryBundle\Repository\CategoryPropertyRepository;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

use function array_merge;

/**
 * Decorator to add category properties during normalization.
 *
 * This decorator class can be used to decorate Akeneo's processor service
 * used to normalize data for the category export. It finds and adds the category properties
 * provided by this bundle to the exported category's data.
 *
 * @see Processor
 */
class ProcessorDecorator implements ItemProcessorInterface
{
    protected NormalizerInterface $normalizer;
    protected CategoryPropertyRepository $categoryPropertyRepository;
    protected StandardToFlatConverter $standardToFlat;
    protected Processor $inner;

    public function __construct(
        CategoryPropertyRepository $categoryPropertyRepository,
        NormalizerInterface $normalizer,
        StandardToFlatConverter $standardToFlat,
        Processor $inner
    ) {
        $this->categoryPropertyRepository = $categoryPropertyRepository;
        $this->normalizer                 = $normalizer;
        $this->standardToFlat             = $standardToFlat;
        $this->inner                      = $inner;
    }

    /**
     * @phpstan-param CategoryInterface $item
     *
     * @return mixed
     *
     * @throws InvalidItemException
     */
    public function process($item)
    {
        $categoryData = $this->inner->process($item);

        $categoryProperties = $this->categoryPropertyRepository->findByCategory($item);
        if ($categoryProperties !== null) {
            $categoryData = array_merge(
                $categoryData,
                $this->standardToFlat->convert($categoryProperties->getProperties())
            );
        }

        return $categoryData;
    }
}
