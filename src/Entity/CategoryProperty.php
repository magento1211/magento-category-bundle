<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Entity;

use Akeneo\Pim\Enrichment\Component\Category\Model\CategoryInterface;

class CategoryProperty
{
    private ?int $id = null;

    /**
     * @var mixed[]
     */
    private array $properties = [];

    private CategoryInterface $category;

    public function __construct(CategoryInterface $category)
    {
        $this->category = $category;
    }

    /**
     * @return mixed[]
     */
    public function getProperties(): array
    {
        return $this->properties;
    }

    /**
     * @param mixed[] $properties
     */
    public function setProperties(array $properties): void
    {
        $this->properties = $properties;
    }

    /**
     * @return CategoryInterface
     */
    public function getCategory(): CategoryInterface
    {
        return $this->category;
    }
}
