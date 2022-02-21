<?php

declare(strict_types=1);

namespace spec\Flagbit\Bundle\CategoryBundle\Controller\InternalApi;

use Doctrine\ORM\EntityManagerInterface;
use Flagbit\Bundle\CategoryBundle\Controller\InternalApi\CategoryConfigController;
use Flagbit\Bundle\CategoryBundle\Entity\CategoryConfig;
use Flagbit\Bundle\CategoryBundle\Repository\CategoryConfigRepository;
use Flagbit\Bundle\CategoryBundle\Schema\SchemaValidator;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class CategoryConfigControllerSpec extends ObjectBehavior
{
    public function let(
        EntityManagerInterface $entityManager,
        CategoryConfigRepository $repository,
        NormalizerInterface $normalizer,
        SchemaValidator $validator
    ): void {
        $this->beConstructedWith($entityManager, $repository, $normalizer, $validator);
    }

    public function it_is_initializable(): void
    {
        $this->shouldHaveType(CategoryConfigController::class);
    }

    public function it_is_new_config(
        CategoryConfigRepository $repository,
        NormalizerInterface $normalizer,
        SchemaValidator $validator
    ): void {
        $repository->find(1)->willReturn(null);

        $validator->validate([])->willReturn([]);

        $normalizer->normalize(Argument::type(CategoryConfig::class), 'internal_api')
            ->willReturn([]);

        $this->get(1)->shouldBeLike(new JsonResponse([]));
    }

    public function it_returns_existing_config(
        CategoryConfigRepository $repository,
        NormalizerInterface $normalizer,
        CategoryConfig $config,
        SchemaValidator $validator
    ): void {
        $repository->find(1)->willReturn($config);

        $validator->validate([])->willReturn([]);

        $normalizer->normalize($config, 'internal_api')
            ->willReturn([]);

        $this->get(1)->shouldBeLike(new JsonResponse([]));
    }

    public function it_saves_config_on_post_request(
        EntityManagerInterface $entityManager,
        CategoryConfigRepository $repository,
        CategoryConfig $config,
        Request $request,
        ParameterBag $requestBag,
        SchemaValidator $validator
    ): void {
        $requestBag->get('config')->willReturn('{}');
        $request->request = $requestBag;
        $request->isXmlHttpRequest()->willReturn(true);

        $repository->find(1)->willReturn($config);

        $validator->validate([])->willReturn([]);

        $entityManager->persist($config)->shouldBeCalledTimes(1);
        $entityManager->flush()->shouldBeCalledTimes(1);

        $this->post($request, 1)->shouldBeLike(new JsonResponse([]));
    }

    public function it_ignores_non_ajax_requests_on_post(
        EntityManagerInterface $entityManager,
        Request $request
    ): void {
        $request->isXmlHttpRequest()->willReturn(false);

        $entityManager->flush()->shouldNotBeCalled();

        $this->post($request, 1)->shouldBeLike(new RedirectResponse('/'));
    }

    public function it_is_invalid_config(
        Request $request,
        ParameterBag $requestBag,
        SchemaValidator $validator
    ): void {
        $requestBag->get('config')->willReturn('{}');
        $request->request = $requestBag;
        $request->isXmlHttpRequest()->willReturn(true);

        $validator->validate(Argument::any())->shouldBeCalled()->willReturn(['error' => 'text']);

        $this->post($request, 1)->shouldBeLike(new JsonResponse([], Response::HTTP_BAD_REQUEST));
    }
}
