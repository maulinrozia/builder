(function($) {
  'use strict';

  $(document).ready(function() {
    $('.vc-image-gallery a').fancybox({
      href: this.href,
      type: 'image'
    });

  });

}(window.jQuery));