<?php

declare(strict_types=1);

namespace Flagbit\Bundle\CategoryBundle\Tests;

/*
 * This file is part of the Akeneo PIM Enterprise Edition.
 *
 * (c) 2014 Akeneo SAS (http://www.akeneo.com)
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\Config\Resource\FileResource;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\RouteCollectionBuilder;

use function array_filter;
use function array_merge;
use function basename;
use function dirname;
use function glob;

/**
 * PIM Kernel
 */
class TestKernel extends BaseKernel
{
    use MicroKernelTrait;

    public function registerBundles(): iterable
    {
        $bundles  = require $this->getProjectDir() . '/vendor/akeneo/pim-community-dev/config/bundles.php';
        $bundles += require $this->getProjectDir() . '/config/bundles.php';
        foreach ($bundles as $class => $envs) {
            if (! ($envs[$this->environment] ?? $envs['all'] ?? false)) {
                continue;
            }

            yield new $class();
        }
    }

    public function getProjectDir(): string
    {
        return dirname(__DIR__);
    }

    protected function configureContainer(ContainerBuilder $container, LoaderInterface $loader): void
    {
        $container->addResource(new FileResource($this->getProjectDir() . '/config/bundles.php'));
        $container->setParameter('container.dumper.inline_class_loader', true);

        $ceConfDir      = $this->getProjectDir() . '/vendor/akeneo/pim-community-dev/config';
        $projectConfDir = $this->getProjectDir() . '/config';

        $this->loadPackagesConfigurationExceptSecurity($loader, $ceConfDir, $this->environment);
        $this->loadPackagesConfiguration($loader, $projectConfDir, $this->environment);

        $this->loadContainerConfiguration($loader, $ceConfDir, $this->environment);
        $this->loadContainerConfiguration($loader, $projectConfDir, $this->environment);
    }

    protected function configureRoutes(RouteCollectionBuilder $routes): void
    {
        $this->loadRoutesConfiguration($routes, $this->getProjectDir() . '/vendor/akeneo/pim-community-dev/config', $this->environment);
        $this->loadRoutesConfiguration($routes, $this->getProjectDir() . '/config', $this->environment);
    }

    public function getCacheDir(): string
    {
        return $this->getProjectDir() . '/tests/var/cache/' . $this->environment;
    }

    public function getLogDir(): string
    {
        return $this->getProjectDir() . '/tests/var/logs';
    }

    private function loadRoutesConfiguration(RouteCollectionBuilder $routes, string $confDir, string $environment): void
    {
        $routes->import($confDir . '/{routes}/' . $environment . '/**/*.yml', '/', 'glob');
        $routes->import($confDir . '/{routes}/*.yml', '/', 'glob');
    }

    private function loadPackagesConfiguration(LoaderInterface $loader, string $confDir, string $environment): void
    {
        $loader->load($confDir . '/{packages}/*.yml', 'glob');
        $loader->load($confDir . '/{packages}/' . $environment . '/**/*.yml', 'glob');
    }

    /**
     * "security.yml" is the only configuration file that can not be override
     * Thus, we don't load it from the Community Edition.
     * We copied/pasted its content into Enterprise Edition and added what was missing.
     */
    private function loadPackagesConfigurationExceptSecurity(LoaderInterface $loader, string $confDir, string $environment): void
    {
        $files = array_merge(
            glob($confDir . '/packages/*.yml'),
            glob($confDir . '/packages/' . $environment . '/*.yml'),
            glob($confDir . '/packages/' . $environment . '/**/*.yml')
        );

        $files = array_filter(
            $files,
            static function ($file) {
                return basename($file) !== 'security.yml';
            }
        );

        foreach ($files as $file) {
            $loader->load($file, 'yaml');
        }
    }

    private function loadContainerConfiguration(LoaderInterface $loader, string $confDir, string $environment): void
    {
        $loader->load($confDir . '/{services}/*.yml', 'glob');
        $loader->load($confDir . '/{services}/' . $environment . '/**/*.yml', 'glob');
    }
}
