;(function () {
  document.body.style.display = 'block'

  reflow()

  window.addEventListener('resize', function () {
    requestReflow()
  })

  Array.prototype.forEach.call(
    document.querySelectorAll('.image-item'),
    function (item) {
      item.addEventListener('contextmenu', onContextmenu)
    }
  )

  function onContextmenu(e) {
    if (!user || user.role !== 'admin') return
    e.preventDefault()
    location = '/tuku/delete?id=' + e.currentTarget.dataset.id
  }

  var reflowTimeoutId

  function requestReflow() {
    if (reflowTimeoutId) return
    reflowTimeoutId = setTimeout(function () {
      reflowTimeoutId = null
      reflow()
    }, 100)
  }

  function reflow() {
    var itemWidth = 300
    var itemMargin = 10

    var container = document.querySelector('#image_list')

    var itemWidthWithMargin = itemWidth + itemMargin * 2

    var rowItemCount

    if (window.innerWidth < itemWidthWithMargin * 2) {
      rowItemCount = 1
      itemWidth = window.innerWidth - itemMargin * 2
      itemWidthWithMargin = itemWidth + itemMargin * 2
    } else {
      rowItemCount = Math.floor(
        window.innerWidth / itemWidthWithMargin
      )
    }

    var containerMaxWidth = rowItemCount * itemWidthWithMargin

    container.style.maxWidth = containerMaxWidth + 'px'

    var items = document.querySelectorAll('.image-item')

    var i, j, item, imageNaturalWidth, imageNaturalHeight
    var x, yList = [], minY, minYIndex

    for (i = 0; i < rowItemCount; i++) {
      yList.push(0)
    }

    for (i = 0; i < items.length; i++) {
      item = items[i]

      imageNaturalWidth = parseFloat(item.dataset.width)
      imageNaturalHeight = parseFloat(item.dataset.height)

      item.style.width = itemWidth + 'px'
      item.style.padding = '10px'

      minYIndex = 0
      minY = yList[0]

      for (j = 0; j < yList.length; j++) {
        if (yList[j] < minY) {
          minYIndex = j
          minY = yList[j]
        }
      }

      x = itemWidthWithMargin * (minYIndex)

      item.style.transform = item.style.webkitTransform =
        'translate(' + (x + itemMargin) + 'px,' +
        (minY + itemMargin) + 'px)'

      yList[minYIndex] += itemWidth *
        imageNaturalHeight / imageNaturalWidth +
        itemMargin * 2
    }

    var maxY = yList[0]

    yList.forEach(function (y) {
      if (y > maxY) maxY = y
    })

    container.style.height = maxY + 'px'
  }
})()