<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\EventListener;

use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ControllerArgumentsEvent;

use function json_decode;

class CollectPropertyValuesListener
{
    /** @phpstan-var ParameterBag<mixed> */
    private ParameterBag $propertyValuesBag;

    /**
     * @phpstan-param ParameterBag<mixed> $propertyValuesBag
     */
    public function __construct(ParameterBag $propertyValuesBag)
    {
        $this->propertyValuesBag = $propertyValuesBag;
    }

    public function onKernelControllerArguments(ControllerArgumentsEvent $event): void
    {
        $request = $event->getRequest();
        if (! $this->isValidRequest($request)) {
            return;
        }

        $propertyJson = $request->request->get('flagbit_category_properties_json');
        $this->propertyValuesBag->replace(json_decode($propertyJson ?? '{}', true));
    }

    private function isValidRequest(Request $request): bool
    {
        return $request->isMethod(Request::METHOD_POST) &&
            $request->attributes->get('_route') === 'pim_enrich_categorytree_edit';
    }
}
