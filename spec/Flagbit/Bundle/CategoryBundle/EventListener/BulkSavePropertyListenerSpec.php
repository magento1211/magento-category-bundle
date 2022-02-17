<?php

declare(strict_types=1);

namespace spec\Flagbit\Bundle\CategoryBundle\EventListener;

use Akeneo\Pim\Enrichment\Component\Category\Model\CategoryInterface;
use EmptyIterator;
use Flagbit\Bundle\CategoryBundle\EventListener\BulkSavePropertyListener;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * @method onCategoryPostSave(GenericEvent $event)
 */
class BulkSavePropertyListenerSpec extends ObjectBehavior
{
    /**
     * @param ParameterBag<string, mixed> $propertyValuesBag
     */
    public function let(
        ParameterBagInterface $propertiesBag,
        ParameterBag $propertyValuesBag
    ): void {
        $this->beConstructedWith($propertiesBag, $propertyValuesBag);
    }

    public function it_is_initializable(): void
    {
        $this->shouldHaveType(BulkSavePropertyListener::class);
    }

    /**
     * @param ParameterBag<string, mixed> $propertyValuesBag
     */
    public function it_ignores_entities_that_are_not_categories(
        GenericEvent $event,
        ParameterBagInterface $propertiesBag,
        ParameterBag $propertyValuesBag
    ): void {
        $event->getSubject()->willReturn(new EmptyIterator());

        $propertyValuesBag->count()->shouldNotBeCalled();

        $this->onCategoryPostSave($event);
    }

    /**
     * @param ParameterBag<string, mixed> $propertyValuesBag
     */
    public function it_never_overwrites_existing_property_value_data(
        GenericEvent $event,
        CategoryInterface $category,
        ParameterBagInterface $propertiesBag,
        ParameterBag $propertyValuesBag
    ): void {
        $event->getSubject()->willReturn($category);
        $category->getCode()->willReturn('master');

        $propertyValuesBag->count()->willReturn(2);

        $propertiesBag->has('master')->shouldNotBeCalled();

        $this->onCategoryPostSave($event);
    }

    /**
     * @param ParameterBag<string, mixed> $propertyValuesBag
     */
    public function it_does_nothing_if_no_properties_registered(
        GenericEvent $event,
        CategoryInterface $category,
        ParameterBagInterface $propertiesBag,
        ParameterBag $propertyValuesBag
    ): void {
        $code = 'master';

        $event->getSubject()->willReturn($category);
        $category->getCode()->willReturn($code);

        $propertyValuesBag->count()->willReturn(0);
        $propertyValuesBag->replace(Argument::any())->shouldNotBeCalled();

        $propertiesBag->has($code)->willReturn(false);

        $this->onCategoryPostSave($event);
    }

    /**
     * @param ParameterBag<string, mixed> $propertyValuesBag
     */
    public function it_updates_property_values_if_data_is_available(
        GenericEvent $event,
        CategoryInterface $category,
        ParameterBagInterface $propertiesBag,
        ParameterBag $propertyValuesBag
    ): void {
        $code = 'master';
        $data = ['some' => 'data', 'in' => 'array'];

        $event->getSubject()->willReturn($category);
        $category->getCode()->willReturn($code);

        $propertyValuesBag->count()->willReturn(0);
        $propertyValuesBag->replace($data)->shouldBeCalledOnce();

        $propertiesBag->has($code)->willReturn(true);
        $propertiesBag->get($code)->willReturn($data);
        $propertiesBag->remove($code)->shouldBeCalledOnce();

        $this->onCategoryPostSave($event);
    }
}
