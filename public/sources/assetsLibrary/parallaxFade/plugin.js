(function (window, document) {
  function createPlugin(element) {
    var Plugin = {
      element: null,
      waypoint: null,
      offset: 45,
      setup: function setup(element) {
        this.fade = this.fade.bind(this);
        // check for data
        if (!element.getVceParallaxFade) {
          element.getVceParallaxFade = this;
          this.element = element;
          this.create();
        } else {
          this.update();
        }
        return element.getVceParallaxFade;
      },
      addFadeEvent: function addFadeEvent() {
        window.addEventListener('scroll', this.fade);
        this.fade();
      },
      removeFadeEvent: function removeFadeEvent() {
        window.removeEventListener('scroll', this.fade);
      },
      fade: function fade() {
        var windowHeight = window.innerHeight;
        var elementRect = this.element.getBoundingClientRect();
        var scrollPercent = scrollPercent = elementRect.bottom / windowHeight * 100;
        if (scrollPercent < this.offset && scrollPercent >= 0) {
          var opacity = (scrollPercent - 5) / this.offset;
          opacity = opacity < 0 ? 0 : opacity;
          this.element.style.opacity = opacity;
        } else {
          this.element.style.opacity = null;
        }
      },
      create: function create() {
        var _this = this;
        this.waypoint = {};
        this.waypoint.top = new Waypoint({
          element: _this.element,
          handler: function handler(direction) {
            if (direction === 'up') {
              _this.removeFadeEvent();
            }
            if (direction === 'down') {
              _this.addFadeEvent();
            }
          },
          offset: 'bottom-in-view'
        });
        this.waypoint.bottom = new Waypoint({
          element: _this.element,
          handler: function handler(direction) {
            if (direction === 'up') {
              _this.addFadeEvent();
            }
            if (direction === 'down') {
              _this.removeFadeEvent();
            }
          },
          offset: function offset() {
            return -this.element.clientHeight;
          }
        });
      },
      update: function update() {
        Waypoint.refreshAll();
      }
    };
    return Plugin.setup(element);
  }

  var plugins = {
    init: function init(selector) {
      Waypoint.refreshAll();
      var elements = document.querySelectorAll(selector);
      elements = [].slice.call(elements);

      var fadeElements = [];
      elements.forEach(function (element) {
        var fadeElement = element.parentNode.nextElementSibling;
        if (fadeElement) {
          fadeElements.push(fadeElement);
        }
      });
      fadeElements.forEach(function (element) {
        if (!element.getVceParallaxFade) {
          createPlugin(element);
        } else {
          element.getVceParallaxFade.update();
        }
      });
      if (fadeElements.length === 1) {
        return fadeElements.pop();
      }
      return fadeElements;
    }
  };
  //
  window.vceAssetsParallaxFade = plugins.init;
})(window, document);