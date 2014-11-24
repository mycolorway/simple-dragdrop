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
    el: document,
    draggable: null,
    droppable: null,
    helper: null,
    placeholder: null
  };

  Dragdrop.prototype._init = function() {
    this.el = $(this.opts.el);
    if (this.el.length === 0) {
      throw new Error("simple-dragdrop: el option is invalid");
    }
    this.draggable = this.el.find(this.opts.draggable);
    if (this.draggable.length === 0) {
      throw new Error("simple-dragdrop: draggable option is invalid");
    }
    this.droppable = this.el.find(this.opts.droppable);
    if (this.droppable.length === 0) {
      throw new Error("simple-dragdrop: droppable option is invalid");
    }
    this.el.data('dragdrop', this);
    this.dragging = false;
    this.helper = null;
    this.placeholder = null;
    this.originalOffset = null;
    return this._bind();
  };

  Dragdrop.prototype._bind = function() {
    return this.el.on('mousedown.simple-dragdrop', this.opts.draggable, (function(_this) {
      return function(e) {
        if (_this.dragging) {
          return;
        }
        e.preventDefault();
        _this.dragging = $(e.currentTarget);
        _this._renderHelper();
        _this._renderPlaceholder();
        _this._initOptions(e);
        _this.trigger('dragstart.simple-dragdrop', _this.dragging);
        $(document).on('mousemove.simple-dragdrop', function(e) {
          var $target;
          if (!_this.dragging) {
            return;
          }
          $target = _this.helper;
          $target.css({
            visibility: 'visible',
            top: -_this.originalOffset.top + e.pageY + 'px',
            left: -_this.originalOffset.left + e.pageX + 'px'
          });
          return _this.trigger('drag.simple-dragdrop', _this.dragging);
        });
        $(document).one('mouseup.simple-dragdrop', function(e) {
          if (!_this.dragging) {
            return;
          }
          _this.trigger('dragend', _this.dragging);
          _this.placeholder.remove();
          _this.dragging.show();
          _this.helper.remove();
          _this.originalOffset = null;
          _this.dragging = null;
          _this.placeholder = null;
          _this.helper = null;
          $(document).off('mouseup.simple-dragdrop mousemove.simple-dragdrop');
          return _this.el.off('mouseenter.simple-dragdrop');
        });
        $(document).one('mouseup.simple-dragdrop', _this.opts.droppable, function(e) {
          var $target;
          $target = $(e.currentTarget);
          if (!$target) {
            return;
          }
          return _this.trigger('drop', $target, _this.dragging);
        });
        return _this.el.on('mouseenter.simple-dragdrop', _this.opts.droppable, function(e) {
          var $target;
          if (!_this.dragging) {
            return;
          }
          $target = $(e.currentTarget);
          _this.trigger('dragenter', $target);
          return $target.one('mouseleave.simple-dragdrop', function(e) {
            if (!_this.dragging) {
              return;
            }
            $target = $(e.currentTarget);
            return _this.trigger('dragleave', $target);
          });
        });
      };
    })(this));
  };

  Dragdrop.prototype._unbind = function() {
    this.el.off('.simple-dragdrop');
    return $(document).off('.simple-dragdrop');
  };

  Dragdrop.prototype.destroy = function() {
    this._unbind();
    return this.el.removeData('dragdrop');
  };

  Dragdrop.prototype._renderHelper = function() {
    if ($.isFunction(this.opts.helper)) {
      this.helper = this.opts.helper.call(this, this.dragging);
    } else if (this.opts.helper) {
      this.helper = $(this.opts.helper).first();
    }
    if (!this.helper) {
      this.helper = this.dragging.clone();
    }
    return this.helper.css({
      'position': 'absolute',
      'pointer-events': 'none',
      'visibility': 'hidden',
      'z-index': 100
    }).appendTo('body');
  };

  Dragdrop.prototype._initOptions = function(e) {
    this.originalOffset = {
      top: this.helper.outerHeight(true) / 2,
      left: this.helper.outerWidth(true) / 2
    };
    return this.helper.css({
      visibility: 'visible',
      top: -this.originalOffset.top + e.pageY + 'px',
      left: -this.originalOffset.left + e.pageX + 'px'
    });
  };

  Dragdrop.prototype._renderPlaceholder = function() {
    if ($.isFunction(this.opts.placeholder)) {
      this.placeholder = this.opts.placeholder.call(this, this.dragging);
    } else if (this.opts.placeholder) {
      this.placeholder = $(this.opts.placeholder).first();
    }
    if (!this.placeholder) {
      this.placeholder = this.dragging.clone(false);
      this.placeholder.css({
        'visibility': 'hidden'
      });
    }
    this.dragging.hide();
    return this.placeholder.insertAfter(this.dragging);
  };

  return Dragdrop;

})(SimpleModule);

dragdrop = function(opts) {
  return new Dragdrop(opts);
};


return dragdrop;


}));

