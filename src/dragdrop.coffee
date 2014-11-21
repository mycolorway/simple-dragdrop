class Dragdrop extends SimpleModule
  opts:
    dragEl: null
    dropEl: null
    helperRender: $.noop

  #TODO: modify top and left
  _init: ->
    @dragEl = $(@opts.dragEl)
    throw new Error "simple-dragdrop: dragEl option is invalid" if @dragEl.length == 0
    @dragEl.addClass 'simple-dragdrop'

    @dropEl = $(@opts.dropEl)
    @dropEl.addClass 'simple-dragdrop'

    @dragging = false
    @originalOffset = null
    @_bind()

  _bind: ->
    @dragEl.on 'mousedown.dragdrop', (e)=>
      return if @dragging
      e.preventDefault()
      @dragging = $(e.currentTarget)
      @helper = @dragging.clone()

      @dragging.addClass 'dragged'

      @helper.addClass 'helper'
        .css
          top: @dragging.offset().top
          left: @dragging.offset().left
        .appendTo 'body'

      @opts.helperRender.call(@, @helper)  if $.isFunction @opts.helperRender

      @originalOffset =
        top: e.clientY - @helper.offset().top
        left: e.clientX - @helper.offset().left

    $(document).on 'mousemove', (e)=>
      return unless @dragging

      $target = @helper
      offsetTop = e.clientY
      offsetLeft = e.clientX

      $target.css
        top: -@originalOffset.top + offsetTop + 'px'
        left: -@originalOffset.left + offsetLeft + 'px'

    $(document).on 'mouseup', (e) =>
      if @dropping
        @.trigger('dropped', @dropping, @dragging)
      return unless @dragging

      @dragging.removeClass 'dragged'
      @dragging = null
      @originalOffset = null

      @dropEl.removeClass 'drop-on'
      @dropping = null
      @helper.remove()
      @helper = null

    @dropEl.on 'mouseover', (e)=>
      return unless @dragging
      $target = $(e.currentTarget)
      $target.addClass 'drop-on'
      @dropping = $target

      $target.one 'mouseleave', (e)=>
        return unless @dragging
        $target = $(e.currentTarget)
        $target.removeClass 'drop-on'
        @dropping = null

dragdrop = (opts) ->
  new Dragdrop(opts)
