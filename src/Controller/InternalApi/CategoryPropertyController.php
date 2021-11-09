<?php

namespace Flagbit\Bundle\CategoryBundle\Controller\InternalApi;

use Doctrine\ORM\EntityManagerInterface;
use Flagbit\Bundle\CategoryBundle\Entity\CategoryProperty;
use Flagbit\Bundle\CategoryBundle\Repository\CategoryPropertyRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * @internal
 */
class CategoryPropertyController
{
    private EntityManagerInterface $entityManager;
    private CategoryPropertyRepository $repository;
    private NormalizerInterface $normalizer;

    public function __construct(
        EntityManagerInterface $entityManager,
        CategoryPropertyRepository $repository,
        NormalizerInterface $normalizer
    ) {
        $this->entityManager = $entityManager;
        $this->repository = $repository;
        $this->normalizer = $normalizer;
    }

    public function get(int $identifier): Response
    {
        $categoryConfig = $this->findProperty($identifier);

        return new JsonResponse(
            $this->normalizer->normalize($categoryConfig, 'internal_api')
        );
    }

    private function findProperty(int $identifier): CategoryProperty
    {
        /** @phpstan-var CategoryProperty|null $categoryConfig */
        $categoryConfig = $this->repository->find($identifier);
        if (null === $categoryConfig) {
            throw new NotFoundHttpException('Property not found');
        }

        return $categoryConfig;
    }
}
