<?php

if (!defined('ABSPATH')) {
    die('-1');
}

use VisualComposer\Helpers\Generic\Templates;

?>

<?php Templates::render('settings/partials/admin-nonce') ?>

<div class="wrap vc_settings">

    <h2><?= __('Visual Composer Settings', 'vc5') ?></h2>

    <?php
    Templates::render(
        'settings/partials/tabs',
        [
            'activeSlug' => $activeSlug,
            'tabs' => $tabs,
        ]
    );
    ?>

    <?php echo $content; ?>

</div>