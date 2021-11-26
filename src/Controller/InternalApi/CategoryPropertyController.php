<?php

namespace Flagbit\Bundle\CategoryBundle\Controller\InternalApi;

use Akeneo\Tool\Component\Classification\Repository\CategoryRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;
use Flagbit\Bundle\CategoryBundle\Entity\CategoryProperty;
use Flagbit\Bundle\CategoryBundle\Repository\CategoryPropertyRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * @internal
 */
class CategoryPropertyController
{
    private EntityManagerInterface $entityManager;
    private CategoryPropertyRepository $repository;
    private NormalizerInterface $normalizer;
    private CategoryRepositoryInterface $categoryRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        CategoryPropertyRepository $repository,
        CategoryRepositoryInterface $categoryRepository,
        NormalizerInterface $normalizer
    ) {
        $this->entityManager = $entityManager;
        $this->repository = $repository;
        $this->categoryRepository = $categoryRepository;
        $this->normalizer = $normalizer;
    }

    public function get(string $identifier): Response
    {
        $categoryProperty = $this->findProperty($identifier);

        $context = [AbstractNormalizer::IGNORED_ATTRIBUTES => ['category']];
        return new JsonResponse(
            $this->normalizer->normalize($categoryProperty, 'internal_api', $context)
        );
    }

    private function findProperty(string $identifier): CategoryProperty
    {
        $category = $this->categoryRepository->findOneByIdentifier($identifier);

        /** @phpstan-var CategoryProperty|null $categoryProperty */
        $categoryProperty = $this->repository->findOneBy(['category' => $category]);
        if (null === $categoryProperty) {
            $categoryProperty = new CategoryProperty($category);
        }

        return $categoryProperty;
    }
}
