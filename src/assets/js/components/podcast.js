;(function(window, document) {
  window.Podcast = function(el) {
    this.el = el
    
    this.onWindowResize = this.onWindowResize.bind(this)
    
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
  }

  Podcast.prototype.onWindowResize = function(event) {
    if (this.el.offsetWidth >= 768)
      this.el.classList.add('full')
    else
      this.el.classList.remove('full')
  }

  // Bootstrap
  Podcast.bootstrap = function() {
    return Array.from(document.querySelectorAll('.podcast'))
      .map(function(header) { return new Podcast(header) })
  }
})(window, document);
