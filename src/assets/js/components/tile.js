;(function(window, document) {
  window.Tile = function(tile) {
    this.el = tile

    if (this.el.tagName === 'A') {
      this.handleClick = this.handleClick.bind(this)
      this.el.addEventListener('click', this.handleClick)
    }
  }

  Tile.prototype.handleClick = function(event) {
    event.stopPropagation()
    event.preventDefault()

    // Start transitioning
    this.el.classList.add('is-transitioning')
    document.body.classList.add('is-transitioning')
    
    // Redirect
    const target = this.el.getAttribute('target'),
      href = this.el.getAttribute('href')
    window.setTimeout(function() {
      if (target === '_blank')
      	window.open(href)
      else
      	location.href = href
    }, 500)
  }

  // Bootstrap
  Tile.bootstrap = function() {
    return Array.from(document.querySelectorAll('.tile'))
      .map(function(tile) { return new Tile(tile) })
  }
})(window, document);
