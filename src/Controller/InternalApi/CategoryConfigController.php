<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Controller\InternalApi;

use Doctrine\ORM\EntityManagerInterface;
use Flagbit\Bundle\CategoryBundle\Entity\CategoryConfig;
use Flagbit\Bundle\CategoryBundle\Repository\CategoryConfigRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

use function json_decode;

/**
 * @internal
 */
class CategoryConfigController
{
    private EntityManagerInterface $entityManager;
    private CategoryConfigRepository $repository;
    private NormalizerInterface $normalizer;

    public function __construct(
        EntityManagerInterface $entityManager,
        CategoryConfigRepository $repository,
        NormalizerInterface $normalizer
    ) {
        $this->entityManager = $entityManager;
        $this->repository    = $repository;
        $this->normalizer    = $normalizer;
    }

    public function get(int $identifier): Response
    {
        $categoryConfig = $this->findConfig($identifier);

        return new JsonResponse(
            $this->normalizer->normalize($categoryConfig, 'internal_api')
        );
    }

    public function post(Request $request, int $identifier): Response
    {
        if (! $request->isXmlHttpRequest()) {
            return new RedirectResponse('/');
        }

        $categoryConfig = $this->findConfig($identifier);

        $config = json_decode($request->request->get('config'), true);
        // TODO Do validation of the config
        $categoryConfig->setConfig($config);

        $this->entityManager->persist($categoryConfig);
        $this->entityManager->flush();

        return new JsonResponse([]);
    }

    private function findConfig(int $identifier): CategoryConfig
    {
        /** @phpstan-var CategoryConfig|null $categoryConfig */
        $categoryConfig = $this->repository->find($identifier);
        if ($categoryConfig === null) {
            return new CategoryConfig([]);
        }

        return $categoryConfig;
    }
}
