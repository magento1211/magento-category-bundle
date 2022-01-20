<?php

namespace spec\Flagbit\Bundle\CategoryBundle\EventListener;

use Akeneo\Pim\Enrichment\Component\Category\Model\CategoryInterface;
use Doctrine\ORM\EntityManagerInterface;
use EmptyIterator;
use Flagbit\Bundle\CategoryBundle\Entity\CategoryProperty;
use Flagbit\Bundle\CategoryBundle\EventListener\SavePropertyListener;
use Flagbit\Bundle\CategoryBundle\Repository\CategoryPropertyRepository;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\ParameterBag;

class SavePropertyListenerSpec extends ObjectBehavior
{
    public function let(
        ParameterBag $propertyValuesBag,
        CategoryPropertyRepository $repository,
        EntityManagerInterface $entityManager
    ): void {
        $this->beConstructedWith($propertyValuesBag, $repository, $entityManager);
    }
    
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(SavePropertyListener::class);
    }

    public function it_ignores_entities_that_are_not_categories(
        GenericEvent $event,
        EntityManagerInterface $entityManager
    ): void {
        $event->getSubject()->willReturn(new EmptyIterator());

        $entityManager->flush()->ShouldNotBeCalled();

        $this->onCategoryPostSave($event);
    }

    public function it_doesnt_have_properties_to_save(
        GenericEvent $event,
        CategoryInterface $category,
        ParameterBag $propertyValuesBag,
        EntityManagerInterface $entityManager,
        CategoryPropertyRepository $repository
    ): void {
        $event->getSubject()->willReturn($category);

        $repository->findOneBy(['category' => $category])->willReturn(null);

        $propertyValuesBag->all()->willReturn([]);

        $entityManager->flush()->ShouldNotBeCalled();

        $this->onCategoryPostSave($event);
    }

    public function it_creates_new_category_property_if_missing(
        GenericEvent $event,
        CategoryInterface $category,
        ParameterBag $propertyValuesBag,
        EntityManagerInterface $entityManager,
        CategoryPropertyRepository $repository
    ): void {
        $event->getSubject()->willReturn($category);

        $repository->findOneBy(['category' => $category])->willReturn(null);

        $propertyValuesBag->all()->willReturn(['foo' => []]);

        $propertiesAreSet = static function (CategoryProperty $categoryProperty): bool {
            return $categoryProperty->getProperties() === ['foo' => []];
        };

        $entityManager->persist(Argument::that($propertiesAreSet))->ShouldBeCalledTimes(1);
        $entityManager->flush()->ShouldBeCalledTimes(1);

        $this->onCategoryPostSave($event);
    }

    public function it_processes(
        GenericEvent $event,
        CategoryInterface $category,
        CategoryProperty $categoryProperty,
        ParameterBag $propertyValuesBag,
        EntityManagerInterface $entityManager,
        CategoryPropertyRepository $repository
    ): void {
        $event->getSubject()->willReturn($category);

        $repository->findOneBy(['category' => $category])->willReturn($categoryProperty);

        $propertyValuesBag->all()->willReturn(['foo' => []]);

        $categoryProperty->setProperties(['foo' => []])->shouldBeCalled();

        $entityManager->persist($categoryProperty)->ShouldBeCalledTimes(1);
        $entityManager->flush()->ShouldBeCalledTimes(1);

        $this->onCategoryPostSave($event);
    }
}
