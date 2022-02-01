<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Entity;

class CategoryConfig
{
    private ?int $id = null;

    /** @var mixed[] */
    private array $config;

    /**
     * @param mixed[] $config
     */
    public function __construct(array $config)
    {
        $this->config = $config;
    }

    /**
     * @return mixed[]
     */
    public function getConfig(): array
    {
        return $this->config;
    }

    /**
     * @param mixed[] $config
     */
    public function setConfig(array $config): void
    {
        $this->config = $config;
    }
}
