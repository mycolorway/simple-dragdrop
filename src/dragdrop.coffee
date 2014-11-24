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
      @_renderPlaceholder()
      @_initOptions(e)

      @.trigger('dragstart.simple-dragdrop', @dragging)

      #bind event
      $(document).on 'mousemove.simple-dragdrop', (e)=>
        return unless @dragging
        $target = @helper
        $target.css
          visibility: 'visible'
          top:-@originalOffset.top + e.pageY + 'px'
          left:-@originalOffset.left + e.pageX + 'px'
        @.trigger('drag.simple-dragdrop', @dragging)

      $(document).one 'mouseup.simple-dragdrop', (e) =>
        return unless @dragging
        @.trigger('dragend', @dragging)

        #reset all
        @placeholder.remove()
        @dragging.show()
        @helper.remove()

        @originalOffset = null
        @dragging = null
        @placeholder = null
        @helper = null

        #remove event
        $(document).off 'mouseup.simple-dragdrop mousemove.simple-dragdrop'
        @el.off 'mouseenter.simple-dragdrop'

      $(document).one 'mouseup.simple-dragdrop', @opts.droppable, (e) =>
        $target = $(e.currentTarget)
        return unless $target
        @.trigger('drop', $target, @dragging)

      @el.on 'mouseenter.simple-dragdrop', @opts.droppable, (e)=>
        return unless @dragging
        $target = $(e.currentTarget)
        @.trigger('dragenter', $target)

        $target.one 'mouseleave.simple-dragdrop', (e)=>
          return unless @dragging
          $target = $(e.currentTarget)
          @.trigger('dragleave', $target)

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
    .appendTo 'body'

  _initOptions: (e) ->
    @originalOffset =
      top: @helper.outerHeight(true)/2
      left: @helper.outerWidth(true)/2

    @helper.css
      visibility: 'visible'
      top:-@originalOffset.top + e.pageY + 'px'
      left:-@originalOffset.left + e.pageX + 'px'


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
