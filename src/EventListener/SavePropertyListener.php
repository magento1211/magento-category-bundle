<?php

namespace Flagbit\Bundle\CategoryBundle\EventListener;

use Akeneo\Pim\Enrichment\Component\Category\Model\CategoryInterface;
use Doctrine\ORM\EntityManagerInterface;
use Flagbit\Bundle\CategoryBundle\Entity\CategoryProperty;
use Flagbit\Bundle\CategoryBundle\Repository\CategoryPropertyRepository;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\ParameterBag;

class SavePropertyListener
{
    /**
     * @phpstan-var ParameterBag<mixed>
     */
    private ParameterBag $propertyValuesBag;
    private CategoryPropertyRepository $repository;
    private EntityManagerInterface $entityManager;

    /**
     * @phpstan-param ParameterBag<mixed> $propertyValuesBag
     */
    public function __construct(
        ParameterBag $propertyValuesBag,
        CategoryPropertyRepository $repository,
        EntityManagerInterface $entityManager
    ) {
        $this->propertyValuesBag = $propertyValuesBag;
        $this->repository = $repository;
        $this->entityManager = $entityManager;
    }

    /**
     * @phpstan-param GenericEvent<mixed> $event
     */
    public function onCategoryPostSave(GenericEvent $event): void
    {
        $category = $event->getSubject();
        if (! $category instanceof CategoryInterface) {
            return;
        }

        $categoryProperty = $this->findProperty($category);

        $properties = $this->propertyValuesBag->all();
        if (count($properties) === 0) {
            return;
        }

        $categoryProperty->setProperties($properties);

        $this->entityManager->persist($categoryProperty);
        $this->entityManager->flush();
    }

    private function findProperty(CategoryInterface $category): CategoryProperty
    {
        /** @phpstan-var CategoryProperty|null $categoryProperty */
        $categoryProperty = $this->repository->findOneBy(['category' => $category]);
        if (null === $categoryProperty) {
            $categoryProperty = new CategoryProperty($category);
        }

        return $categoryProperty;
    }
}
