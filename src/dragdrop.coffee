class Dragdrop extends SimpleModule
  opts:
    el: document
    draggable: null
    droppable: null
    helper: null
    placeholder: null

  _init: ->
    @el = $(@opts.el)
    throw new Error "simple-dragdrop: el option is invalid" if @el.length == 0

    @draggable = @el.find(@opts.draggable)
    throw new Error "simple-dragdrop: draggable option is invalid" if @draggable.length == 0

    @droppable = @el.find(@opts.droppable)
    throw new Error "simple-dragdrop: droppable option is invalid" if @droppable.length == 0

    @el.data('dragdrop', @)

    @dragging = false
    @dropping = null
    @helper = null
    @placeholder = null
    @originalOffset = null

    @_bind()

  _bind: ->
    @el.on 'mousedown.simple-dragdrop', @opts.draggable , (e)=>
      return if @dragging
      e.preventDefault()

      @dragging = $(e.currentTarget)
      @_renderHelper(e)
      @_renderPlaceholder()

      @.trigger('dragstart.simple-dragdrop', @dragging)

    $(document).on 'mousemove.simple-dragdrop', (e)=>
      return unless @dragging
      $target = @helper
      $target.css
        visibility: 'visible'
        top:-@originalOffset.top + e.clientY + 'px'
        left:-@originalOffset.left + e.clientX + 'px'
      @.trigger('drag.simple-dragdrop', @dragging)

    $(document).on 'mouseup.simple-dragdrop', (e) =>
      return unless @dragging
      if @dropping
        @.trigger('drop', @dropping, @dragging)
      @.trigger('dragend', @dragging)

      @placeholder.replaceWith(@dragging)
      @helper.remove()

      #reset all
      @originalOffset = null
      @dropping = null
      @dragging = null
      @placeholder = null
      @helper = null

    @el.on 'mouseenter.simple-dragdrop', @opts.droppable, (e)=>
      return unless @dragging
      $target = $(e.currentTarget)
      @dropping = $target
      @.trigger('dragenter', @dropping)

      $target.one 'mouseleave.simple-dragdrop', (e)=>
        return unless @dragging
        @.trigger('dragleave', @dropping)
        $target = $(e.currentTarget)
        $target.removeClass 'drop-on'
        @dropping = null

  _unbind: ->
    @el.off '.simple-dragdrop'
    $(document).off '.simple-dragdrop'

  destroy: ->
    @_unbind()
    @el.removeData 'dragdrop'

  _renderHelper: (e) ->
    if $.isFunction @opts.helper
      @helper = @dragging.clone()
      @opts.helper.call(@, @helper)
    else if @opts.helper
      @helper = $(@opts.helper).first()

    @helper = @dragging.clone() unless @helper

    @helper.css
      'position': 'fixed'
      'pointer-events': 'none'
      'visibility': 'hidden'
      'z-index': 100
    .appendTo 'body'

    @originalOffset =
      top: @helper.outerHeight(true)/2
      left: @helper.outerWidth(true)/2

    @helper.css
      'visibility': 'visible'
      top:-@originalOffset.top + e.clientY + 'px'
      left:-@originalOffset.left + e.clientX + 'px'

  _renderPlaceholder: ->
    if $.isFunction @opts.placeholder
      @placeholder = @dragging.clone()
      @opts.placeholder.call(@, @placeholder)
    else if @opts.placeholder
      @placeholder = $(@opts.placeholder).first()

    unless @placeholder
      @placeholder = @dragging.clone(false)
      @placeholder.css
        'visibility': 'hidden'

    @dragging.replaceWith(@placeholder)

dragdrop = (opts) ->
  new Dragdrop(opts)
