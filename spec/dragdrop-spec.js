(function() {
  describe('dragdrop', function() {
    var $draggable, $droppable, $tpl, dragOffset, dropOffset, endDragStop, mousedown, mousemove, mouseup, tpl;
    tpl = '<div class="test" style="margin: 30px">\n  <div class="draggable"></div>\n  <div class="droppable"></div>\n</div>';
    $tpl = $(tpl);
    $tpl.appendTo('body');
    $draggable = $tpl.find('.draggable');
    $droppable = $tpl.find('.droppable');
    $draggable.css({
      height: 100,
      width: 100,
      border: '1px solid black'
    });
    $droppable.css({
      height: 100,
      width: 100,
      border: '1px solid black'
    });
    dragOffset = $tpl.find('.draggable').offset();
    dropOffset = $tpl.find('.droppable').offset();
    mousedown = function(x, y) {
      var e;
      e = $.Event('mousedown', {
        pageX: dragOffset.left + x,
        pageY: dragOffset.left + y
      });
      return $draggable.trigger(e);
    };
    mouseup = function(x, y) {
      var e;
      e = $.Event('mouseup', {
        pageX: dropOffset.left + x,
        pageY: dropOffset.left + y
      });
      return $(document).trigger(e);
    };
    mousemove = function(x, y, offset) {
      var e;
      if (offset == null) {
        offset = dragOffset;
      }
      e = $.Event('mousemove', {
        pageX: offset.left + x,
        pageY: offset.top + y
      });
      return $(document).trigger(e);
    };
    endDragStop = function() {
      var dragdrop;
      $(document).trigger('mouseup');
      dragdrop = $(document).data('dragdrop');
      return dragdrop != null ? dragdrop.destroy() : void 0;
    };
    afterEach(function() {
      return endDragStop();
    });
    it('should perform drag after certain distance', function() {
      simple.dragdrop({
        draggable: '.draggable',
        droppable: '.droppable',
        distance: 10
      });
      mousedown(5, 5);
      expect($tpl.find('.draggable').length).toBe(1);
      mousemove(10, 10);
      expect($tpl.find('.draggable').length).toBe(1);
      mousemove(16, 16);
      return expect($tpl.find('.draggable').length).toBe(3);
    });
    it('should render specific helper', function() {
      simple.dragdrop({
        draggable: '.draggable',
        droppable: '.droppable',
        helper: $('<div class="dom-helper">DOM Helper</div>')
      });
      mousedown(5, 5);
      mousemove(10, 10);
      expect($tpl.find('.dom-helper')).toExist();
      endDragStop();
      simple.dragdrop({
        draggable: '.draggable',
        droppable: '.droppable',
        helper: function(dragging) {
          var $dragging;
          $dragging = $(dragging).clone();
          $dragging.addClass('functional-helper');
          return $dragging;
        }
      });
      mousedown(5, 5);
      mousemove(10, 10);
      return expect($tpl.find('.functional-helper')).toExist();
    });
    it('should render specific placeholder', function() {
      simple.dragdrop({
        draggable: '.draggable',
        droppable: '.droppable',
        placeholder: $('<div class="dom-helper">DOM Helper</div>')
      });
      mousedown(5, 5);
      mousemove(10, 10);
      expect($tpl.find('.dom-helper')).toExist();
      endDragStop();
      simple.dragdrop({
        draggable: '.draggable',
        droppable: '.droppable',
        placeholder: function(dragging) {
          var $dragging;
          $dragging = $(dragging).clone();
          $dragging.addClass('functional-helper');
          return $dragging;
        }
      });
      mousedown(5, 5);
      mousemove(10, 10);
      return expect($tpl.find('.functional-helper')).toExist();
    });
    it('should render helper at specific cursor position', function() {
      var pos;
      simple.dragdrop({
        draggable: '.draggable',
        droppable: '.droppable',
        helper: function(dragging) {
          var $dragging;
          $dragging = $(dragging).clone();
          $dragging.addClass('helper');
          return $dragging;
        }
      });
      mousedown(5, 5);
      mousemove(10, 10);
      pos = {
        top: dragOffset.top,
        left: dragOffset.left
      };
      expect(Math.abs($tpl.find('.helper').offset().top - pos.top)).toBeLessThan(3);
      expect(Math.abs($tpl.find('.helper').offset().left - pos.left)).toBeLessThan(3);
      endDragStop();
      simple.dragdrop({
        draggable: '.draggable',
        droppable: '.droppable',
        helper: function(dragging) {
          var $dragging;
          $dragging = $(dragging).clone();
          $dragging.addClass('helper');
          return $dragging;
        },
        cursorPosition: 'corner'
      });
      mousedown(5, 5);
      mousemove(10, 10);
      mousemove(10, 10);
      pos = {
        top: dragOffset.top + 10,
        left: dragOffset.left + 10
      };
      expect(Math.abs($tpl.find('.helper').offset().top - pos.top)).toBeLessThan(3);
      expect(Math.abs($tpl.find('.helper').offset().left - pos.left)).toBeLessThan(3);
      endDragStop();
      simple.dragdrop({
        draggable: '.draggable',
        droppable: '.droppable',
        helper: function(dragging) {
          var $dragging;
          $dragging = $(dragging).clone();
          $dragging.addClass('helper');
          return $dragging;
        },
        cursorPosition: 'center'
      });
      mousedown(5, 5);
      mousemove(10, 10);
      mousemove(10, 10);
      pos = {
        top: dragOffset.top + 10 - 50,
        left: dragOffset.left + 10 - 50
      };
      expect(Math.abs($tpl.find('.helper').offset().top - pos.top)).toBeLessThan(3);
      expect(Math.abs($tpl.find('.helper').offset().left - pos.left)).toBeLessThan(3);
      return endDragStop();
    });
    return it('shoud trigger custom event', function() {
      var dragdrop, spyDragDes, spyDragEnd, spyDragEnter, spyDragLeave, spyDragStart, spyDrop;
      dragdrop = simple.dragdrop({
        draggable: '.draggable',
        droppable: '.droppable'
      });
      spyDragStart = spyOnEvent(dragdrop, 'dragstart');
      spyDragEnter = spyOnEvent(dragdrop, 'dragenter');
      spyDragLeave = spyOnEvent(dragdrop, 'dragleave');
      spyDrop = spyOnEvent(dragdrop, 'drop');
      spyDragEnd = spyOnEvent(dragdrop, 'dragend');
      spyDragDes = spyOnEvent(dragdrop, 'destroy');
      mousedown(5, 5);
      mousemove(10, 10);
      expect(spyDragStart).toHaveBeenTriggered();
      $droppable.trigger('mouseenter');
      expect(spyDragEnter).toHaveBeenTriggered();
      $droppable.trigger('mouseleave');
      expect(spyDragLeave).toHaveBeenTriggered();
      $droppable.trigger('mouseup');
      expect(spyDrop).toHaveBeenTriggered();
      expect(spyDragEnd).toHaveBeenTriggered();
      endDragStop();
      return expect(spyDragDes).toHaveBeenTriggered();
    });
  });

}).call(this);
