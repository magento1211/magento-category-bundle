<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\EventListener;

use Akeneo\Pim\Enrichment\Component\Category\Model\CategoryInterface;
use Doctrine\ORM\EntityManagerInterface;
use Flagbit\Bundle\CategoryBundle\Entity\CategoryProperty;
use Flagbit\Bundle\CategoryBundle\Repository\CategoryPropertyRepository;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\ParameterBag;

use function count;
use function is_array;

/**
 * Category post save listener that handles bulk saves with properties.
 */
class BulkSavePropertyListener
{
    /** @var ParameterBag<string, array<string, mixed>> */
    private ParameterBag $propertiesBag;
    private CategoryPropertyRepository $repository;
    private EntityManagerInterface $entityManager;

    /**
     * @phpstan-param ParameterBag<string, array<string, mixed>> $propertiesBag
     */
    public function __construct(
        ParameterBag $propertiesBag,
        CategoryPropertyRepository $repository,
        EntityManagerInterface $entityManager
    ) {
        $this->propertiesBag = $propertiesBag;
        $this->repository    = $repository;
        $this->entityManager = $entityManager;
    }

    /**
     * @phpstan-param GenericEvent<mixed> $event
     */
    public function onBulkCategoryPostSave(GenericEvent $event): void
    {
        // Save category properties
        foreach ($event->getSubject() as $category) {
            if (! $category instanceof CategoryInterface) {
                continue;
            }

            if (! $this->propertiesBag->has($category->getCode())) {
                continue;
            }

            $properties = $this->propertiesBag->get($category->getCode());
            if (count($properties) === 0) {
                return;
            }

            $categoryProperty = $this->findProperty($category);
            $categoryProperty->setProperties($this->mergeProperties($categoryProperty->getProperties(), $properties));

            $this->entityManager->persist($categoryProperty);
            $this->entityManager->flush();
        }
    }

    private function findProperty(CategoryInterface $category): CategoryProperty
    {
        /** @phpstan-var CategoryProperty|null $categoryProperty */
        $categoryProperty = $this->repository->findOneBy(['category' => $category]);
        if ($categoryProperty === null) {
            $categoryProperty = new CategoryProperty($category);
        }

        return $categoryProperty;
    }

    /**
     * Merge original data with new data
     *
     * This function works like a recursive array merge,
     * but does replace old values with new values instead of building a new array
     * containing both values.
     *
     * @phpstan-param array<string, mixed> $oldData
     * @phpstan-param array<string, mixed> $newData
     *
     * @return array<string, array<string, mixed>>
     */
    private function mergeProperties(array $oldData, array $newData): array
    {
        $mergedArray = $oldData;

        foreach ($newData as $key => $value) {
            if (is_array($value) && isset($mergedArray[$key]) && is_array($mergedArray[$key])) {
                $mergedArray[$key] = $this->mergeProperties($mergedArray[$key], $value);
            } else {
                $mergedArray[$key] = $value;
            }
        }

        return $mergedArray;
    }
}
