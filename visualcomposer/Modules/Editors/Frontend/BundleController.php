<?php

namespace VisualComposer\Modules\Editors\Frontend;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;

class BundleController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Frontend\BundleController::addHeadBundleStyle */
        $this->addFilter('vcv:frontend:head:extraOutput', 'addHeadBundleStyle');

        /** @see \VisualComposer\Modules\Editors\Frontend\BundleController::addFooterBundleScript */
        $this->addFilter('vcv:frontend:footer:extraOutput', 'addFooterBundleScript');
    }

    protected function addHeadBundleStyle($response, $payload, Url $urlHelper)
    {
        // Add CSS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<link id="vcv-style-fe-bundle" 
rel="stylesheet" property="stylesheet" type="text/css" href="%s" />',
                    vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')
                        ?
                        content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/editor/wp.bundle.css?' . VCV_VERSION
                        // TODO: Check latest downloaded version
                        :
                        $urlHelper->to(
                            'public/dist/wp.bundle.css?' . VCV_VERSION
                        )
                ),
            ]
        );

        return $response;
    }

    protected function addFooterBundleScript($response, $payload, Url $urlHelper)
    {
        // Add JS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<script id="vcv-script-fe-bundle" type="text/javascript" src="%s"></script>',
                    vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')
                        ?
                        content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/editor/wp.bundle.js?' . VCV_VERSION
                        // TODO Check latest download version
                        :
                        $urlHelper->to(
                            'public/dist/wp.bundle.js?' . VCV_VERSION
                        )
                ),
            ]
        );

        return $response;
    }
}
