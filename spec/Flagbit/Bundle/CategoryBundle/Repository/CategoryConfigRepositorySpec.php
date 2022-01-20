<?php

namespace spec\Flagbit\Bundle\CategoryBundle\Repository;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use Flagbit\Bundle\CategoryBundle\Repository\CategoryConfigRepository;
use PhpSpec\ObjectBehavior;

class CategoryConfigRepositorySpec extends ObjectBehavior
{
    public function let(EntityManagerInterface $em, ClassMetadata $class): void
    {
        $this->beConstructedWith($em, $class);
    }

    public function it_is_initializable(): void
    {
        $this->shouldHaveType(CategoryConfigRepository::class);
    }
}
