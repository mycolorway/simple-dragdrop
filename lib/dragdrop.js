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
    placeholder: null,
    cursorPosition: 'auto',
    cursorOffset: {
      top: 0,
      left: 0
    },
    axis: null
  };

  Dragdrop.prototype._init = function() {
    var dragdrop;
    this.el = $(this.opts.el);
    if (this.el.length === 0) {
      throw new Error("simple-dragdrop: el option is invalid");
    }
    dragdrop = this.el.data('dragdrop');
    if (dragdrop) {
      dragdrop.destroy();
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
        var timer;
        if (_this.dragging) {
          return;
        }
        e.preventDefault();
        _this.dragging = $(e.currentTarget);
        timer = setTimeout(function() {
          $(document).off('.simple-dragdrop.click');
          if (!_this.clicked) {
            _this._processDrag(e);
          }
          return _this.clicked = false;
        }, 200);
        $(document).one('mouseup.simple-dragdrop.click', function(e) {
          e.preventDefault();
          _this.clicked = true;
          $(document).off('.simple-dragdrop.click');
          _this.trigger('click', _this.dragging);
          return _this.dragging = null;
        });
        return $(document).one('mousemove.simple-dragdrop.click', function() {
          clearTimeout(timer);
          $(document).off('.simple-dragdrop.click');
          if (!_this.clicked) {
            _this._processDrag(e);
          }
          return _this.clicked = false;
        });
      };
    })(this));
  };

  Dragdrop.prototype._unbind = function() {
    this.el.off('.simple-dragdrop');
    return $(document).off('.simple-dragdrop');
  };

  Dragdrop.prototype._processDrag = function(e) {
    if (!this.dragging) {
      return;
    }
    this._renderHelper();
    this._dragStart(e);
    this._renderPlaceholder();
    this.trigger('dragstart', this.dragging);
    $(document).on('mousemove.simple-dragdrop', (function(_this) {
      return function(e) {
        if (!_this.dragging) {
          return;
        }
        _this._dragMove(e);
        return _this.trigger('drag', _this.dragging);
      };
    })(this));
    $(document).one('mouseup.simple-dragdrop', (function(_this) {
      return function(e) {
        if (!_this.dragging) {
          return;
        }
        _this.trigger('dragend', _this.dragging);
        return _this._dragEnd();
      };
    })(this));
    $(document).one('mouseup.simple-dragdrop', this.opts.droppable, (function(_this) {
      return function(e) {
        var $target;
        $target = $(e.currentTarget);
        if (!$target) {
          return;
        }
        return _this.trigger('drop', [_this.dragging, $target]);
      };
    })(this));
    this.el.on('mouseenter.simple-dragdrop', this.opts.droppable, (function(_this) {
      return function(e) {
        var $target;
        if (!_this.dragging) {
          return;
        }
        $target = $(e.currentTarget);
        return _this.trigger('dragenter', [_this.dragging, $target]);
      };
    })(this));
    return this.el.on('mouseleave.simple-dragdrop', this.opts.droppable, (function(_this) {
      return function(e) {
        var $target;
        if (!_this.dragging) {
          return;
        }
        $target = $(e.currentTarget);
        return _this.trigger('dragleave', [_this.dragging, $target]);
      };
    })(this));
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
    }).insertAfter(this.dragging);
  };

  Dragdrop.prototype._dragStart = function(e) {
    var cursorPosition;
    cursorPosition = this.helper.data('cursorPosition');
    if (!cursorPosition) {
      cursorPosition = this.opts.cursorPosition;
    }
    switch (cursorPosition) {
      case 'auto':
        this.originalOffset = {
          top: this.dragging.position().top,
          left: this.dragging.position().left
        };
        break;
      case 'center':
        this.originalOffset = {
          top: this.dragging.position().top + e.pageY - this.dragging.offset().top - this.helper.outerHeight(true) / 2,
          left: this.dragging.position().left + e.pageX - this.dragging.offset().left - this.helper.outerWidth(true) / 2
        };
        break;
      case 'corner':
        this.originalOffset = {
          top: this.dragging.position().top + e.pageY - this.dragging.offset().top,
          left: this.dragging.position().left + e.pageX - this.dragging.offset().left
        };
    }
    this.originalOffset.top += this.opts.cursorOffset.top;
    this.originalOffset.left += this.opts.cursorOffset.left;
    this.originalPosition = {
      top: e.pageY,
      left: e.pageX
    };
    return this.helper.css({
      visibility: 'visible',
      top: this.originalOffset.top,
      left: this.originalOffset.left
    });
  };

  Dragdrop.prototype._dragMove = function(e) {
    var delatX, deltaY, left, top;
    deltaY = e.pageY - this.originalPosition.top;
    delatX = e.pageX - this.originalPosition.left;
    top = this.originalOffset.top + deltaY;
    left = this.originalOffset.left + delatX;
    if (this.opts.axis === 'x') {
      top = null;
    }
    if (this.opts.axis === 'y') {
      left = null;
    }
    return this.helper.css({
      visibility: 'visible',
      top: top,
      left: left
    });
  };

  Dragdrop.prototype._dragEnd = function() {
    this.placeholder.remove();
    this.dragging.show();
    this.helper.remove();
    this.originalOffset = null;
    this.dragging = null;
    this.placeholder = null;
    this.helper = null;
    $(document).off('mouseup.simple-dragdrop mousemove.simple-dragdrop');
    return this.el.off('mouseenter.simple-dragdrop mousemove.simple-dragdrop');
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

