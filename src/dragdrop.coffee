class Dragdrop extends SimpleModule
  opts:
    el: document
    draggable: null
    droppable: null
    helper: null
    placeholder: null
    cursor: 'move'
    cursorPosition: 'auto'
    cursorOffset:
      top: 0
      left: 0
    distance: 1
    axis: null
    handle: ''

  _init: ->
    @el = $(@opts.el)
    throw new Error "simple-dragdrop: el option is invalid" if @el.length == 0

    dragdrop = @el.data 'dragdrop'
    dragdrop.destroy() if dragdrop

    @el.data('dragdrop', @)

    @dragging = false
    @helper = null
    @placeholder = null
    @originalOffset = null

    @_bind()

  _bind: ->
    @el.on 'mousedown.simple-dragdrop', @opts.draggable , (e)=>
      return if @dragging

      $target = $(e.currentTarget)
      handleEl = $target.find(@opts.handle).get(0)
      return if @opts.handle and !$.contains(handleEl, e.target) and handleEl != e.target

      pos =
        top: e.pageY
        left: e.pageX

      #bind event for drag buffer
      $(document).one 'mouseup.simple-dragdrop', =>
        $(document).off 'mousemove.simple-dragdrop'

      $(document).on 'mousemove.simple-dragdrop', (e2) =>
        if Math.abs(e.pageX - e2.pageX) > @opts.distance or Math.abs(e.pageY - e2.pageY) > @opts.distance
          $(document).off 'mouseup.simple-dragdrop'
          $(document).off 'mousemove.simple-dragdrop'
          @_dragStart($target, pos)

  _unbind: ->
    @el.off '.simple-dragdrop'
    $(document).off '.simple-dragdrop'

  _dragStart: ($target, pos) ->
    @dragging = $target
    $body = $('body').css 'cursor', @opts.cursor
    @_disableSelection $body

    @_renderHelper()
    @_initPosition(pos)
    @_renderPlaceholder()
    @trigger 'dragstart',
      dragging: @dragging
      helper: @helper
      placeholder: @placeholder

    #bind event for drag&drop
    $(document).on 'mousemove.simple-dragdrop', (e)=>
      return unless @dragging
      pos =
        top: e.pageY
        left: e.pageX
      @_dragMove(pos)
      @trigger 'drag',
        dragging: @dragging
        helper: @helper
        placeholder: @placeholder

    $(document).one 'mouseup.simple-dragdrop', (e) =>
      return unless @dragging
      $dragging = $(@dragging)
      @trigger 'before-dragend',
        dragging: $dragging
        helper: @helper
        placeholder: @placeholder
      @_dragEnd()
      @trigger 'dragend',
        dragging: $dragging

    $(document).one 'mouseup.simple-dragdrop', @opts.droppable, (e) =>
      $target = $(e.currentTarget)
      $dragging = $(@dragging)
      return unless $target
      #when drop event triggered, dragend will be triggered in this scope, and reset all
      @trigger 'before-dragend',
        dragging: $dragging
        helper: @helper
        placeholder: @placeholder
      @_dragEnd()
      @trigger 'dragend',
        dragging: $dragging
      @trigger 'drop',
        dragging: $dragging
        target: $target

    @el.on 'mouseenter.simple-dragdrop', @opts.droppable, (e)=>
      return unless @dragging
      $target = $(e.currentTarget)
      @trigger 'dragenter',
        dragging: @dragging
        helper: @helper
        placeholder: @placeholder
        target: $target

    @el.on 'mouseleave.simple-dragdrop', @opts.droppable, (e)=>
      return unless @dragging
      $target = $(e.currentTarget)
      @trigger 'dragleave',
        dragging: @dragging
        helper: @helper
        placeholder: @placeholder
        target: $target

  _renderHelper: ->
    if $.isFunction @opts.helper
      @helper = @opts.helper.call(@, @dragging)
    else if @opts.helper
      @helper = $(@opts.helper).first()

    @helper = @dragging.clone() unless @helper

    @helper.css
      'position': 'absolute'
      'pointer-events': 'none'
      'visibility': 'hidden'
      'z-index': 100
    .insertAfter @dragging

  _renderPlaceholder: ->
    if $.isFunction @opts.placeholder
      @placeholder = @opts.placeholder.call(@, @dragging)
    else if @opts.placeholder
      @placeholder = $(@opts.placeholder).first()

    unless @placeholder
      @placeholder = @dragging.clone(false)
      @placeholder.css
        'visibility': 'hidden'

    @dragging.hide()
    @placeholder.insertAfter(@dragging)

  _initPosition: (pos) ->
    cursorPosition = @helper.data 'cursorPosition'
    cursorPosition = @opts.cursorPosition unless cursorPosition

    switch cursorPosition
      when 'auto'
        @originalOffset =
          top: @dragging.position().top
          left: @dragging.position().left

      when 'center'
        @originalOffset =
          top: @dragging.position().top + pos.top - @dragging.offset().top - @helper.outerHeight(true)/2
          left: @dragging.position().left + pos.left - @dragging.offset().left - @helper.outerWidth(true)/2

      when 'corner'
        @originalOffset =
          top: @dragging.position().top + pos.top - @dragging.offset().top
          left: @dragging.position().left + pos.left - @dragging.offset().left

    @originalOffset.top += @opts.cursorOffset.top
    @originalOffset.left += @opts.cursorOffset.left

    @originalPosition =
      top: pos.top
      left: pos.left

    @helper.css
      visibility: 'visible'
      top: @originalOffset.top
      left: @originalOffset.left

  _dragMove: (pos) ->
    deltaY = pos.top - @originalPosition.top
    delatX = pos.left - @originalPosition.left

    top = @originalOffset.top + deltaY
    left = @originalOffset.left + delatX

    #TODO: modify axis
    top = null if @opts.axis is 'x'
    left = null if @opts.axis is 'y'

    @helper.css
      visibility: 'visible'
      top: top
      left: left

  _dragEnd: ->
    @placeholder.remove()
    @dragging.show()
    @helper.remove()

    @originalOffset = null
    @dragging = null
    @placeholder = null
    @helper = null

    $(document).off 'mouseup.simple-dragdrop mousemove.simple-dragdrop'
    @el.off 'mouseenter.simple-dragdrop mousemove.simple-dragdrop'
    $body = $('body').css 'cursor', ''
    @_enableSelection $body

  _disableSelection: ($el) ->
    $el.css 'user-select': 'none'

  _enableSelection: ($el) ->
    $el.css 'user-select': ''

  destroy: ->
    @triggerHandler 'destroy'
    @_unbind()
    @el.removeData 'dragdrop'


dragdrop = (opts) ->
  new Dragdrop(opts)

dragdrop.class = Dragdrop
