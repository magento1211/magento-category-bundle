<?php

declare(strict_types=1);

namespace spec\Flagbit\Bundle\CategoryBundle\EventListener;

use Akeneo\Pim\Enrichment\Component\Category\Model\CategoryInterface;
use Doctrine\ORM\EntityManagerInterface;
use EmptyIterator;
use Flagbit\Bundle\CategoryBundle\Entity\CategoryProperty;
use Flagbit\Bundle\CategoryBundle\EventListener\BulkSavePropertyListener;
use Flagbit\Bundle\CategoryBundle\Repository\CategoryPropertyRepository;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * @method onBulkCategoryPostSave(GenericEvent $event)
 */
class BulkSavePropertyListenerSpec extends ObjectBehavior
{
    public function let(
        ParameterBag $propertiesBag,
        CategoryPropertyRepository $repository,
        EntityManagerInterface $entityManager
    ): void {
        $this->beConstructedWith($propertiesBag, $repository, $entityManager);
    }

    public function it_is_initializable(): void
    {
        $this->shouldHaveType(BulkSavePropertyListener::class);
    }

    public function it_ignores_entities_that_are_not_categories(
        GenericEvent $event,
        ParameterBag $propertiesBag
    ): void {
        $event->getSubject()->willReturn([new EmptyIterator(), new EmptyIterator()]);

        $propertiesBag->has(Argument::any())->shouldNotBeCalled();

        $this->onBulkCategoryPostSave($event);
    }

    public function it_ignores_categories_where_no_property_data_is_available(
        GenericEvent $event,
        ParameterBag $propertiesBag,
        CategoryInterface $category1,
        CategoryInterface $category2
    ): void {
        $event->getSubject()->willReturn([$category1, $category2]);
        $category1->getCode()->willReturn('electronics');
        $category2->getCode()->willReturn('clothes');

        $propertiesBag->has('electronics')->willReturn(false);
        $propertiesBag->has('clothes')->willReturn(false);

        $propertiesBag->get('electronics')->shouldNotHaveBeenCalled();
        $propertiesBag->get('clothes')->shouldNotHaveBeenCalled();

        $this->onBulkCategoryPostSave($event);
    }

    public function it_ignores_categories_where_property_data_is_empty(
        GenericEvent $event,
        ParameterBag $propertiesBag,
        CategoryPropertyRepository $repository,
        CategoryInterface $category1,
        CategoryInterface $category2
    ): void {
        $event->getSubject()->willReturn([$category1, $category2]);
        $category1->getCode()->willReturn('electronics');
        $category2->getCode()->willReturn('clothes');

        $propertiesBag->has('electronics')->willReturn(true);
        $propertiesBag->has('clothes')->willReturn(true);

        $propertiesBag->get('electronics')->willReturn([]);
        $propertiesBag->get('clothes')->willReturn([]);

        $repository->findOneBy(['category' => $category1])->shouldNotHaveBeenCalled();
        $repository->findOneBy(['category' => $category2])->shouldNotHaveBeenCalled();

        $this->onBulkCategoryPostSave($event);
    }

    public function it_saves_with_existing_properties(
        GenericEvent $event,
        ParameterBag $propertiesBag,
        CategoryPropertyRepository $repository,
        EntityManagerInterface $entityManager,
        CategoryInterface $category1,
        CategoryInterface $category2,
        CategoryProperty $categoryProperty1,
        CategoryProperty $categoryProperty2
    ): void {
        $event->getSubject()->willReturn([$category1, $category2]);
        $category1->getCode()->willReturn('electronics');
        $category2->getCode()->willReturn('clothes');

        $propertiesBag->has('electronics')->willReturn(true);
        $propertiesBag->has('clothes')->willReturn(true);

        $propertiesBag->get('electronics')->willReturn(['foo' => []]);
        $propertiesBag->get('clothes')->willReturn(['faa' => []]);

        $repository->findOneBy(['category' => $category1])->willReturn($categoryProperty1);
        $repository->findOneBy(['category' => $category2])->willReturn($categoryProperty2);

        $categoryProperty1->getProperties()->willReturn([]);
        $categoryProperty2->getProperties()->willReturn([]);

        $categoryProperty1->mergeProperties(['foo' => []])->shouldBeCalledOnce();
        $categoryProperty2->mergeProperties(['faa' => []])->shouldBeCalledOnce();

        $entityManager->persist($categoryProperty1)->shouldBeCalledOnce();
        $entityManager->persist($categoryProperty2)->shouldBeCalledOnce();

        $entityManager->flush()->shouldBeCalledTimes(2);

        $this->onBulkCategoryPostSave($event);
    }

    public function it_saves_without_existing_properties(
        GenericEvent $event,
        ParameterBag $propertiesBag,
        CategoryPropertyRepository $repository,
        EntityManagerInterface $entityManager,
        CategoryInterface $category1,
        CategoryInterface $category2,
        CategoryProperty $categoryProperty1,
        CategoryProperty $categoryProperty2
    ): void {
        $event->getSubject()->willReturn([$category1, $category2]);
        $category1->getCode()->willReturn('electronics');
        $category2->getCode()->willReturn('clothes');

        $propertiesBag->has('electronics')->willReturn(true);
        $propertiesBag->has('clothes')->willReturn(true);

        $propertiesBag->get('electronics')->willReturn(['foo' => []]);
        $propertiesBag->get('clothes')->willReturn(['faa' => []]);

        $repository->findOneBy(['category' => $category1])->willReturn(null);
        $repository->findOneBy(['category' => $category2])->willReturn(null);

        $categoryProperty1->getProperties()->willReturn([]);
        $categoryProperty2->getProperties()->willReturn([]);

        $propertiesAreSetForCategory1 = static function (CategoryProperty $categoryProperty): bool {
            return $categoryProperty->getProperties() === ['foo' => []];
        };
        $propertiesAreSetForCategory2 = static function (CategoryProperty $categoryProperty): bool {
            return $categoryProperty->getProperties() === ['faa' => []];
        };

        $entityManager->persist(Argument::that($propertiesAreSetForCategory1))->shouldBeCalledOnce();
        $entityManager->persist(Argument::that($propertiesAreSetForCategory2))->shouldBeCalledOnce();

        $entityManager->flush()->shouldBeCalledTimes(2);

        $this->onBulkCategoryPostSave($event);
    }
}
