<?php

namespace VisualComposer\Modules\Development;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

/**
 * Class Categories
 * @package VisualComposer\Modules\Hub
 */
class HubCategories extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Categories constructor.
     */
    public function __construct()
    {
        if (vcvenv('VCV_ENV_DEV_CATEGORIES')) {
            $this->wpAddAction(
                'init',
                'dummySetCategories'
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    protected function dummySetCategories(Options $optionHelper, Url $urlHelper)
    {
        $optionHelper->set(
            'hubCategories',
            [
                'Row' => [
                    'title' => 'Row/Column',
                    'elements' => ['row'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Row.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Row.svg'),
                ],
                'Column' => [
                    'title' => 'Column',
                    'elements' => ['column'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Column.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Column.svg'),
                ],
                'Button' => [
                    'title' => 'Simple Button',
                    'elements' => [
                        'basicButton',
                        'outlineButton',
                        'gradientButton',
                        'animatedOutlineButton',
                        'doubleOutlineButton',
                    ],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Button.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Button.svg'),
                ],
                'Feature' => [
                    'title' => 'Feature',
                    'elements' => ['feature'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Feature.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Feature.svg'),
                ],
                'Feature section' => [
                    'title' => 'Feature Section',
                    'elements' => ['featureSection'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Feature.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Feature.svg'),
                ],
                'Section' => [
                    'title' => 'Section',
                    'elements' => [],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Section.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Section.svg'),
                ],
                'Hero section' => [
                    'title' => 'Hero Section',
                    'elements' => ['heroSection'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Hero-Section.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Hero-Section.svg'),
                ],
                'Icon' => [
                    'title' => 'Icon',
                    'elements' => ['icon'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Icon.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Icon.svg'),
                ],
                'Single image' => [
                    'title' => 'Single Image',
                    'elements' => ['singleImage'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Single-Image.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Single-Image.svg'),
                ],
                'Image gallery' => [
                    'title' => 'Image Gallery',
                    'elements' => ['imageMasonryGallery', 'imageGallery'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Image-Gallery.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Image-Gallery.svg'),
                ],
                'Text block' => [
                    'title' => 'Text Block',
                    'elements' => ['textBlock', 'googleFontsHeading'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Text-Block.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Text-Block.svg'),
                ],
                'Misc' => [
                    'title' => 'Misc',
                    'elements' => ['rawHtml', 'rawJs', 'shortcode'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Misc.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Misc.svg'),
                ],
                'Social' => [
                    'title' => 'Social',
                    'elements' => [
                        'twitterGrid',
                        'twitterTweet',
                        'twitterTimeline',
                        'twitterButton',
                        'flickrImage',
                        'instagramImage',
                        'googlePlusButton',
                        'pinterestPinit',
                        'facebookLike',
                    ],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Social.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Social.svg'),
                ],
                'Videos' => [
                    'title' => 'Videos',
                    'elements' => ['youtubePlayer', 'vimeoPlayer'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Video.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Video.svg'),
                ],
                'WooCommerce' => [
                    'title' => 'WooCommerce',
                    'elements' => [],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Misc.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Misc.svg'),
                ],
                'WP Widgets' => [
                    'title' => 'WP Widgets',
                    'elements' => ['wpWidgetsCustom', 'wpWidgetsDefault'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/WordPress.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/WordPress.svg'),
                ],
                'Separators' => [
                    'title' => 'Separators',
                    'elements' => ['separator'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Separator.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Separator.svg'),
                ],
                'Maps' => [
                    'title' => 'Maps',
                    'elements' => ['googleMaps'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Map.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Map.svg'),
                ],
                'Grids' => [
                    'title' => 'Grids',
                    'elements' => [],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Post-Grid.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Post-Grid.svg'),
                ],
                '_postsGridSources' => [
                    'title' => 'Post Grid Data Sources',
                    'elements' => [
                        'postsGridDataSourcePost',
                        'postsGridDataSourcePage',
                        'postsGridDataSourceCustomPostType',
                    ],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Post-Grid.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Post-Grid.svg'),
                ],
                'Toggle' => [
                    'title' => 'Toggle',
                    'elements' => ['faqToggle'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Toggle.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Toggle.svg'),
                ],
            ]
        );
    }
}
