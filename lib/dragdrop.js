(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simple-dragdrop', ["jquery","simple-module"], function (a0,b1) {
      return (root['dragdrop'] = factory(a0,b1));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['dragdrop'] = factory(jQuery,SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Dragdrop, dragdrop,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Dragdrop = (function(superClass) {
  extend(Dragdrop, superClass);

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
    distance: 1,
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
        var $target, pos;
        if (_this.dragging) {
          return;
        }
        e.preventDefault();
        $target = $(e.currentTarget);
        pos = {
          top: e.pageY,
          left: e.pageX
        };
        $(document).one('mouseup.simple-dragdrop', function() {
          return $(document).off('mousemove.simple-dragdrop');
        });
        return $(document).on('mousemove.simple-dragdrop', function(e2) {
          if (Math.abs(e.pageX - e2.pageX) > _this.opts.distance || Math.abs(e.pageY - e2.pageY) > _this.opts.distance) {
            $(document).off('mouseup.simple-dragdrop');
            $(document).off('mousemove.simple-dragdrop');
            return _this._dragStart($target, pos);
          }
        });
      };
    })(this));
  };

  Dragdrop.prototype._unbind = function() {
    this.el.off('.simple-dragdrop');
    return $(document).off('.simple-dragdrop');
  };

  Dragdrop.prototype._dragStart = function($target, pos) {
    this.dragging = $target;
    this._renderHelper();
    this._initPosition(pos);
    this._renderPlaceholder();
    this.trigger('dragstart', {
      dragging: this.dragging,
      helper: this.helper,
      placeholder: this.placeholder
    });
    $(document).on('mousemove.simple-dragdrop', (function(_this) {
      return function(e) {
        if (!_this.dragging) {
          return;
        }
        pos = {
          top: e.pageY,
          left: e.pageX
        };
        _this._dragMove(pos);
        return _this.trigger('drag', {
          dragging: _this.dragging,
          helper: _this.helper,
          placeholder: _this.placeholder
        });
      };
    })(this));
    $(document).one('mouseup.simple-dragdrop', (function(_this) {
      return function(e) {
        var $dragging;
        if (!_this.dragging) {
          return;
        }
        $dragging = $(_this.dragging);
        _this.trigger('before-dragend', {
          dragging: $dragging,
          helper: _this.helper,
          placeholder: _this.placeholder
        });
        _this._dragEnd();
        return _this.trigger('dragend', {
          dragging: $dragging
        });
      };
    })(this));
    $(document).one('mouseup.simple-dragdrop', this.opts.droppable, (function(_this) {
      return function(e) {
        var $dragging;
        $target = $(e.currentTarget);
        $dragging = $(_this.dragging);
        if (!$target) {
          return;
        }
        _this.trigger('before-dragend', {
          dragging: $dragging,
          helper: _this.helper,
          placeholder: _this.placeholder
        });
        _this._dragEnd();
        _this.trigger('dragend', {
          dragging: $dragging
        });
        return _this.trigger('drop', {
          dragging: $dragging,
          target: $target
        });
      };
    })(this));
    this.el.on('mouseenter.simple-dragdrop', this.opts.droppable, (function(_this) {
      return function(e) {
        if (!_this.dragging) {
          return;
        }
        $target = $(e.currentTarget);
        return _this.trigger('dragenter', {
          dragging: _this.dragging,
          helper: _this.helper,
          placeholder: _this.placeholder,
          target: $target
        });
      };
    })(this));
    return this.el.on('mouseleave.simple-dragdrop', this.opts.droppable, (function(_this) {
      return function(e) {
        if (!_this.dragging) {
          return;
        }
        $target = $(e.currentTarget);
        return _this.trigger('dragleave', {
          dragging: _this.dragging,
          helper: _this.helper,
          placeholder: _this.placeholder,
          target: $target
        });
      };
    })(this));
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

  Dragdrop.prototype._initPosition = function(pos) {
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
          top: this.dragging.position().top + pos.top - this.dragging.offset().top - this.helper.outerHeight(true) / 2,
          left: this.dragging.position().left + pos.left - this.dragging.offset().left - this.helper.outerWidth(true) / 2
        };
        break;
      case 'corner':
        this.originalOffset = {
          top: this.dragging.position().top + pos.top - this.dragging.offset().top,
          left: this.dragging.position().left + pos.left - this.dragging.offset().left
        };
    }
    this.originalOffset.top += this.opts.cursorOffset.top;
    this.originalOffset.left += this.opts.cursorOffset.left;
    this.originalPosition = {
      top: pos.top,
      left: pos.left
    };
    return this.helper.css({
      visibility: 'visible',
      top: this.originalOffset.top,
      left: this.originalOffset.left
    });
  };

  Dragdrop.prototype._dragMove = function(pos) {
    var delatX, deltaY, left, top;
    deltaY = pos.top - this.originalPosition.top;
    delatX = pos.left - this.originalPosition.left;
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

  Dragdrop.prototype.destroy = function() {
    this._unbind();
    return this.el.removeData('dragdrop');
  };

  return Dragdrop;

})(SimpleModule);

dragdrop = function(opts) {
  return new Dragdrop(opts);
};

dragdrop["class"] = Dragdrop;

return dragdrop;

}));