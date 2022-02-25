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
            $categoryProperty->aggregate($properties);

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
}
