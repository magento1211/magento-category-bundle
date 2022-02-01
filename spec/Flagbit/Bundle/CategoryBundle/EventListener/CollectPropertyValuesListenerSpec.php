<?php

declare(strict_types=1);

namespace spec\Flagbit\Bundle\CategoryBundle\EventListener;

use Flagbit\Bundle\CategoryBundle\EventListener\CollectPropertyValuesListener;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ControllerArgumentsEvent;

class CollectPropertyValuesListenerSpec extends ObjectBehavior
{
    public function let(ParameterBag $parameterBag): void
    {
        $this->beConstructedWith($parameterBag);
    }

    public function it_is_initializable(): void
    {
        $this->shouldHaveType(CollectPropertyValuesListener::class);
    }

    public function it_replaces_parameters_by_valid_request(
        ControllerArgumentsEvent $event,
        Request $request,
        ParameterBag $parameterBag,
        ParameterBag $requestBag,
        ParameterBag $attributesBag
    ): void {
        $request->request    = $requestBag;
        $request->attributes = $attributesBag;
        $request->isMethod(Request::METHOD_POST)->willReturn(true);

        $attributesBag->get('_route')->willReturn('pim_enrich_categorytree_edit');

        $requestBag->get('flagbit_category_properties_json')->willReturn('{"flagbit_category_properties_json": {"foo": "bar"}}');

        $expectedValue = [
            'flagbit_category_properties_json' => ['foo' => 'bar'],
        ];
        $parameterBag->replace($expectedValue)->shouldBeCalledTimes(1);

        $event->getRequest()->willReturn($request);

        $this->onKernelControllerArguments($event);
    }

    public function it_replaces_parameters_with_default_when_null(
        ControllerArgumentsEvent $event,
        Request $request,
        ParameterBag $parameterBag,
        ParameterBag $requestBag,
        ParameterBag $attributesBag
    ): void {
        $request->request    = $requestBag;
        $request->attributes = $attributesBag;
        $request->isMethod(Request::METHOD_POST)->willReturn(true);

        $attributesBag->get('_route')->willReturn('pim_enrich_categorytree_edit');

        $requestBag->get('flagbit_category_properties_json')->willReturn(null);

        $parameterBag->replace([])->shouldBeCalledTimes(1);

        $event->getRequest()->willReturn($request);

        $this->onKernelControllerArguments($event);
    }

    public function it_ignores_when_not_method_post(
        ControllerArgumentsEvent $event,
        Request $request,
        ParameterBag $parameterBag,
        ParameterBag $attributesBag
    ): void {
        $request->attributes = $attributesBag;
        $request->isMethod(Request::METHOD_POST)->willReturn(false);

        $attributesBag->get('_route')->willReturn('pim_enrich_categorytree_edit');

        $parameterBag->replace(Argument::any())->shouldNotBeCalled();

        $event->getRequest()->willReturn($request);

        $this->onKernelControllerArguments($event);
    }

    public function it_ignores_when_different_route(
        ControllerArgumentsEvent $event,
        Request $request,
        ParameterBag $parameterBag,
        ParameterBag $attributesBag
    ): void {
        $request->attributes = $attributesBag;
        $request->isMethod(Request::METHOD_POST)->willReturn(true);

        $attributesBag->get('_route')->willReturn('pim_foo');

        $parameterBag->replace(Argument::any())->shouldNotBeCalled();

        $event->getRequest()->willReturn($request);

        $this->onKernelControllerArguments($event);
    }
}
