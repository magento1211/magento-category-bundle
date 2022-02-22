<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\EventListener;

use Akeneo\Pim\Enrichment\Component\Category\Model\CategoryInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * Category post save listener that handles bulk saves with properties.
 */
class BulkSavePropertyListener
{
    /** @var ParameterBag<string, array<string, mixed>> */
    private ParameterBag $propertiesBag;
    /** @var ParameterBag<string, mixed> */
    private ParameterBag $propertyValuesBag;

    /**
     * @phpstan-param ParameterBag<string, array<string, mixed>> $propertiesBag
     * @phpstan-param ParameterBag<mixed>                        $propertyValuesBag
     */
    public function __construct(
        ParameterBag $propertiesBag,
        ParameterBag $propertyValuesBag
    ) {
        $this->propertiesBag     = $propertiesBag;
        $this->propertyValuesBag = $propertyValuesBag;
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

        $code = $category->getCode();

        // Never override existing data to prevent side effects
        if ($this->propertyValuesBag->count() !== 0) {
            return;
        }

        if (! $this->propertiesBag->has($code)) {
            return;
        }

        $this->propertyValuesBag->replace($this->propertiesBag->get($code));
        $this->propertiesBag->remove($code);
    }
}
