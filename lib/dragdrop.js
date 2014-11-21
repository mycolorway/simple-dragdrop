(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('simple-dragdrop', ["jquery",
      "simple-module"], function ($, SimpleModule) {
      return (root.returnExportsGlobal = factory($, SimpleModule));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),
      require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['dragdrop'] = factory(jQuery,
      SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Dragdrop, dragdrop,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Dragdrop = (function(_super) {
  __extends(Dragdrop, _super);

  function Dragdrop() {
    return Dragdrop.__super__.constructor.apply(this, arguments);
  }

  Dragdrop.prototype.opts = {
    dragEl: null,
    dropEl: null,
    helperRender: $.noop
  };

  Dragdrop.prototype._init = function() {
    this.dragEl = $(this.opts.dragEl);
    if (this.dragEl.length === 0) {
      throw new Error("simple-dragdrop: dragEl option is invalid");
    }
    this.dragEl.addClass('simple-dragdrop');
    this.dropEl = $(this.opts.dropEl);
    this.dropEl.addClass('simple-dragdrop');
    this.dragging = false;
    this.originalOffset = null;
    return this._bind();
  };

  Dragdrop.prototype._bind = function() {
    this.dragEl.on('mousedown.dragdrop', (function(_this) {
      return function(e) {
        if (_this.dragging) {
          return;
        }
        e.preventDefault();
        _this.dragging = $(e.currentTarget);
        _this.helper = _this.dragging.clone();
        _this.dragging.addClass('dragged');
        _this.helper.addClass('helper').css({
          top: _this.dragging.offset().top,
          left: _this.dragging.offset().left
        }).appendTo('body');
        if ($.isFunction(_this.opts.helperRender)) {
          _this.opts.helperRender.call(_this, _this.helper);
        }
        return _this.originalOffset = {
          top: e.clientY - _this.helper.offset().top,
          left: e.clientX - _this.helper.offset().left
        };
      };
    })(this));
    $(document).on('mousemove', (function(_this) {
      return function(e) {
        var $target, offsetLeft, offsetTop;
        if (!_this.dragging) {
          return;
        }
        $target = _this.helper;
        offsetTop = e.clientY;
        offsetLeft = e.clientX;
        return $target.css({
          top: -_this.originalOffset.top + offsetTop + 'px',
          left: -_this.originalOffset.left + offsetLeft + 'px'
        });
      };
    })(this));
    $(document).on('mouseup', (function(_this) {
      return function(e) {
        if (_this.dropping) {
          _this.trigger('dropped', _this.dropping, _this.dragging);
        }
        if (!_this.dragging) {
          return;
        }
        _this.dragging.removeClass('dragged');
        _this.dragging = null;
        _this.originalOffset = null;
        _this.dropEl.removeClass('drop-on');
        _this.dropping = null;
        _this.helper.remove();
        return _this.helper = null;
      };
    })(this));
    return this.dropEl.on('mouseover', (function(_this) {
      return function(e) {
        var $target;
        if (!_this.dragging) {
          return;
        }
        $target = $(e.currentTarget);
        $target.addClass('drop-on');
        _this.dropping = $target;
        return $target.one('mouseleave', function(e) {
          if (!_this.dragging) {
            return;
          }
          $target = $(e.currentTarget);
          $target.removeClass('drop-on');
          return _this.dropping = null;
        });
      };
    })(this));
  };

  return Dragdrop;

})(SimpleModule);

dragdrop = function(opts) {
  return new Dragdrop(opts);
};


return dragdrop;


}));

