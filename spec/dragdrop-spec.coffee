describe 'dragdrop', ->

  tpl = '''
    <div class="test" style="margin: 30px">
      <div class="draggable"></div>
      <div class="droppable"></div>
    </div>
  '''
  $tpl = $(tpl)
  $tpl.appendTo 'body'

  $draggable = $tpl.find '.draggable'
  $droppable = $tpl.find '.droppable'

  $draggable.css
    height: 100
    width: 100
    border: '1px solid black'

  $droppable.css
    height: 100
    width: 100
    border: '1px solid black'

  dragOffset = $tpl.find('.draggable').offset()
  dropOffset = $tpl.find('.droppable').offset()

  mousedown = (x, y) ->
    e = $.Event 'mousedown',
      pageX: dragOffset.left + x
      pageY: dragOffset.left + y
    $draggable.trigger e

  mouseup = (x, y) ->
    e = $.Event 'mouseup',
      pageX: dropOffset.left + x
      pageY: dropOffset.left + y
    $(document).trigger e

  mousemove = (x, y, offset = dragOffset) ->
    e = $.Event 'mousemove',
      pageX: offset.left + x
      pageY: offset.top + y
    $(document).trigger e

  endDragStop = ->
    $(document).trigger 'mouseup'
    dragdrop = $(document).data 'dragdrop'
    dragdrop?.destroy()

  afterEach ->
    endDragStop()

  it 'should perform drag after certain distance', ->
    simple.dragdrop
      draggable: '.draggable'
      droppable: '.droppable'
      distance: 10

    mousedown(5, 5)
    expect($tpl.find('.draggable').length).toBe(1)

    mousemove(10, 10)
    expect($tpl.find('.draggable').length).toBe(1)

    mousemove(16, 16)
    expect($tpl.find('.draggable').length).toBe(3)


  it 'should render specific helper', ->
    #DOM_Helper
    simple.dragdrop
      draggable: '.draggable'
      droppable: '.droppable'
      helper: $('<div class="dom-helper">DOM Helper</div>')

    mousedown(5, 5)
    mousemove(10, 10)
    expect($tpl.find('.dom-helper')).toExist()

    endDragStop()

    #Functional Helper
    simple.dragdrop
      draggable: '.draggable'
      droppable: '.droppable'
      helper: (dragging) ->
        $dragging =$(dragging).clone()
        $dragging.addClass 'functional-helper'
        $dragging

    mousedown(5, 5)
    mousemove(10, 10)
    expect($tpl.find('.functional-helper')).toExist()


  it 'should render specific placeholder', ->
    #DOM_Helper
    simple.dragdrop
      draggable: '.draggable'
      droppable: '.droppable'
      placeholder: $('<div class="dom-helper">DOM Helper</div>')

    mousedown(5, 5)
    mousemove(10, 10)
    expect($tpl.find('.dom-helper')).toExist()

    endDragStop()

    #Functional Helper
    simple.dragdrop
      draggable: '.draggable'
      droppable: '.droppable'
      placeholder: (dragging) ->
        $dragging =$(dragging).clone()
        $dragging.addClass 'functional-helper'
        $dragging

    mousedown(5, 5)
    mousemove(10, 10)
    expect($tpl.find('.functional-helper')).toExist()

  it 'should render helper at specific cursor position', ->
    simple.dragdrop
      draggable: '.draggable'
      droppable: '.droppable'
      helper: (dragging) ->
        $dragging =$(dragging).clone()
        $dragging.addClass 'helper'
        $dragging

    mousedown(5, 5)
    mousemove(10, 10)

    pos =
      top: dragOffset.top
      left: dragOffset.left

    expect(Math.abs($tpl.find('.helper').offset().top - pos.top)).toBeLessThan(3)
    expect(Math.abs($tpl.find('.helper').offset().left - pos.left)).toBeLessThan(3)

    endDragStop()

    simple.dragdrop
      draggable: '.draggable'
      droppable: '.droppable'
      helper: (dragging) ->
        $dragging =$(dragging).clone()
        $dragging.addClass 'helper'
        $dragging
      cursorPosition: 'corner'

    mousedown(5, 5)
    mousemove(10, 10)
    #drag need 2 mousemove to set postion based on current cursor!
    mousemove(10, 10)

    pos =
      top: dragOffset.top + 10
      left: dragOffset.left + 10

    expect(Math.abs($tpl.find('.helper').offset().top - pos.top)).toBeLessThan(3)
    expect(Math.abs($tpl.find('.helper').offset().left - pos.left)).toBeLessThan(3)
    endDragStop()

    simple.dragdrop
      draggable: '.draggable'
      droppable: '.droppable'
      helper: (dragging) ->
        $dragging =$(dragging).clone()
        $dragging.addClass 'helper'
        $dragging
      cursorPosition: 'center'

    mousedown(5, 5)
    mousemove(10, 10)
    #drag need 2 mousemove to set postion based on current cursor!
    mousemove(10, 10)

    pos =
      top: dragOffset.top + 10 - 50
      left: dragOffset.left + 10 - 50

    expect(Math.abs($tpl.find('.helper').offset().top - pos.top)).toBeLessThan(3)
    expect(Math.abs($tpl.find('.helper').offset().left - pos.left)).toBeLessThan(3)
    endDragStop()

  it 'shoud trigger custom event', ->
    dragdrop = simple.dragdrop
      draggable: '.draggable'
      droppable: '.droppable'

    spyDragStart = spyOnEvent(dragdrop, 'dragstart')
    spyDragEnter = spyOnEvent(dragdrop, 'dragenter')
    spyDragLeave = spyOnEvent(dragdrop, 'dragleave')
    spyDrop = spyOnEvent(dragdrop, 'drop')
    spyDragEnd = spyOnEvent(dragdrop, 'dragend')
    spyDragDes = spyOnEvent(dragdrop, 'dragdestroy')

    mousedown(5, 5)
    mousemove(10, 10)

    expect(spyDragStart).toHaveBeenTriggered()

    $droppable.trigger 'mouseenter'
    expect(spyDragEnter).toHaveBeenTriggered()

    $droppable.trigger 'mouseleave'
    expect(spyDragLeave).toHaveBeenTriggered()

    $droppable.trigger 'mouseup'
    expect(spyDrop).toHaveBeenTriggered()
    expect(spyDragEnd).toHaveBeenTriggered()

    endDragStop()
    expect(spyDragDes).toHaveBeenTriggered()

