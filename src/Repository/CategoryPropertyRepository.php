<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Repository;

use Akeneo\Pim\Enrichment\Component\Category\Model\CategoryInterface;
use Doctrine\ORM\EntityRepository;
use Flagbit\Bundle\CategoryBundle\Entity\CategoryProperty;

use function assert;

class CategoryPropertyRepository extends EntityRepository
{
    public function findByCategory(CategoryInterface $category): ?CategoryProperty
    {
        $categoryProperty = $this->findOneBy(['category' => $category]);

        assert($categoryProperty instanceof CategoryProperty || $categoryProperty === null);

        return $categoryProperty;
    }
}
