<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Str;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class EnqueueController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $actionPriority = 50;
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueGlobalAssets', $actionPriority);

        /** @see \VisualComposer\Modules\Assets\EnqueueController::enqueueAssets */
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueAssets', $actionPriority);

        $this->wpAddAction('wp_enqueue_scripts', 'enqueueSourceAssets', $actionPriority);

        $this->wpAddFilter('language_attributes', 'addNoJs', $actionPriority);
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Str $strHelper
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     */
    protected function enqueueGlobalAssets(Options $optionsHelper, Str $strHelper, Frontend $frontendHelper)
    {
        $bundleUrl = $optionsHelper->get('globalElementsCssFileUrl');
        if ($bundleUrl && !$frontendHelper->isPageEditable()) {
            wp_enqueue_style('vcv:assets:global:styles:' . $strHelper->slugify($bundleUrl), $bundleUrl);
        }
    }

    /**
     * @param \VisualComposer\Helpers\Str $strHelper
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     */
    protected function enqueueSourceAssets(Str $strHelper, Frontend $frontendHelper)
    {
        $sourceId = get_the_ID();
        $bundleUrl = get_post_meta($sourceId, 'vcvSourceCssFileUrl', true);
        if ($bundleUrl && !$frontendHelper->isPageEditable()) {
            wp_enqueue_style('vcv:assets:source:main:styles:' . $strHelper->slugify($bundleUrl), $bundleUrl);
        }
    }

    /**
     * @param \VisualComposer\Helpers\Str $strHelper
     */
    protected function enqueueAssets(Str $strHelper, Frontend $frontendHelper)
    {
        if ($frontendHelper->isPageEditable()) {
            return;
        }
        $sourceId = get_the_ID();
        $assetsFiles = get_post_meta($sourceId, 'vcvSourceAssetsFiles', true);

        if (!is_array($assetsFiles)) {
            return;
        }

        if (isset($assetsFiles['cssBundles']) && is_array($assetsFiles['cssBundles'])) {
            foreach ($assetsFiles['cssBundles'] as $asset) {
                wp_enqueue_style('vcv:assets:source:styles:' . $strHelper->slugify($asset), $asset);
            }
            unset($asset);
        }

        if (isset($assetsFiles['jsBundles']) && is_array($assetsFiles['jsBundles'])) {
            foreach ($assetsFiles['jsBundles'] as $asset) {
                wp_enqueue_script('vcv:assets:source:scripts:' . $strHelper->slugify($asset), $asset);
            }
            unset($asset);
        }
    }

    protected function addNoJs($output)
    {
        $output .= ' data-vcv-no-js="true" ';

        return $output;
    }
}
