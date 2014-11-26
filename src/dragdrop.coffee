class Dragdrop extends SimpleModule
  opts:
    el: document
    draggable: null
    droppable: null
    helper: null
    placeholder: null
    cursorPosition: 'auto'
    cursorOffset:
      top: 0
      left: 0
    axis: null

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
      e.preventDefault()

      @dragging = $(e.currentTarget)
      @_renderHelper()
      @_dragStart(e)
      @_renderPlaceholder()

      @.trigger('dragstart', @dragging)

      #bind event
      $(document).on 'mousemove.simple-dragdrop', (e)=>
        return unless @dragging
        @_dragMove(e)
        @.trigger('drag', @dragging)

      $(document).one 'mouseup.simple-dragdrop', (e) =>
        return unless @dragging
        @.trigger('dragend', @dragging)
        @_dragEnd()

      #Dropevent
      $(document).one 'mouseup.simple-dragdrop', @opts.droppable, (e) =>
        $target = $(e.currentTarget)
        return unless $target
        @.trigger('drop', [@dragging, $target])

      @el.on 'mouseenter.simple-dragdrop', @opts.droppable, (e)=>
        return unless @dragging
        $target = $(e.currentTarget)
        @.trigger('dragenter', [@dragging, $target])

      @el.on 'mouseleave.simple-dragdrop', @opts.droppable, (e)=>
        return unless @dragging
        $target = $(e.currentTarget)
        @.trigger('dragleave', [@dragging, $target])

  _unbind: ->
    @el.off '.simple-dragdrop'
    $(document).off '.simple-dragdrop'

  destroy: ->
    @_unbind()
    @el.removeData 'dragdrop'

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

  _dragStart: (e) ->
    cursorPosition = @helper.data 'cursorPosition'
    cursorPosition = @opts.cursorPosition unless cursorPosition

    switch cursorPosition
      when 'auto'
        @originalOffset =
          top: @dragging.position().top
          left: @dragging.position().left

      when 'center'
        @originalOffset =
          top: @dragging.position().top + e.pageY - @dragging.offset().top - @helper.outerHeight(true)/2
          left: @dragging.position().left + e.pageX - @dragging.offset().left - @helper.outerWidth(true)/2

      when 'corner'
        @originalOffset =
          top: @dragging.position().top + e.pageY - @dragging.offset().top
          left: @dragging.position().left + e.pageX - @dragging.offset().left

    @originalOffset.top += @opts.cursorOffset.top
    @originalOffset.left += @opts.cursorOffset.left

    @originalPosition =
      top: e.pageY
      left: e.pageX

    @helper.css
      visibility: 'visible'
      top: @originalOffset.top
      left: @originalOffset.left

  _dragMove: (e) ->
    deltaY = e.pageY - @originalPosition.top
    delatX = e.pageX - @originalPosition.left

    top = @originalOffset.top + deltaY
    left = @originalOffset.left + delatX

    #TODO: modify axis
    top = null if @opts.axis is 'x'
    left = null if @opts.axis is 'y'

    @helper.css
      visibility: 'visible'
      top: top
      left: left

  _dragEnd: () ->
    @placeholder.remove()
    @dragging.show()
    @helper.remove()

    @originalOffset = null
    @dragging = null
    @placeholder = null
    @helper = null

    $(document).off 'mouseup.simple-dragdrop mousemove.simple-dragdrop'
    @el.off 'mouseenter.simple-dragdrop mousemove.simple-dragdrop'

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

dragdrop = (opts) ->
  new Dragdrop(opts)
