;(function(window, document) {
  window.SiteHeader = function(header) {
    this.el = header
    
    this.banner = Array.from(document.querySelectorAll('.banner'))
      .filter(function (banner) {
        return !banner.matches('main .banner')
      })[0]

    if (this.banner) {
      this.handleWaypoint = this.handleWaypoint.bind(this)
      
      this.waypoint = new Waypoint({
        element: this.banner,
        offset: '-90%',
        handler: this.handleWaypoint
      })
    }
  }

  SiteHeader.prototype.handleWaypoint = function(direction) {
    console.log(direction)
    if (direction === 'down') {
      this.el.classList.remove('alt')
      this.el.classList.add('reveal')
    } else {
      this.el.classList.add('alt')
    }
  }

  // Bootstrap
  SiteHeader.bootstrap = function() {
    return Array.from(document.querySelectorAll('.site-header'))
      .map(function(header) { return new SiteHeader(header) })
  }
})(window, document);
