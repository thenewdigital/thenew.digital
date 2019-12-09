;(function(window, document) {
  window.Menu = function(menu) {
    this.el = menu
    this.inner = menu.querySelector('.site-menu__wrap')
    this.toggler = document.querySelector('a[href="#menu"]')
    
    this.close = document.createElement('button')
    this.close.classList.add('close')
    this.close.textContent = 'Close'
    this.el.appendChild(this.close)
    
    this.locked = false
    
    this.lock = this.lock.bind(this)
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
    this.toggle = this.toggle.bind(this)
    this.handleInnerClick = this.handleInnerClick.bind(this)
    this.handleBodyKeydown = this.handleBodyKeydown.bind(this)
    
    this.toggler.addEventListener('click', this.toggle)
    this.close.addEventListener('click', this.close)
    this.inner.addEventListener('click', this.handleInnerClick)
    document.addEventListener('click', this.hide)
    document.addEventListener('keydown', this.handleBodyKeydown)
  }
  
  Menu.prototype.lock = function() {
    if (this.locked) return false
    
    this.locked = true
    
    const self = this
    setTimeout(function() {
      self.locked = false
    })
    
    return true
  }

  Menu.prototype.show = function(event) {
    if (event) event.preventDefault()
    if (this.lock()) document.body.classList.add('is-menu-visible')
  }
  
  Menu.prototype.hide = function(event) {
    // if (event) event.preventDefault()
    if (this.lock()) document.body.classList.remove('is-menu-visible')
  }
  
  Menu.prototype.toggle = function(event) {
    if (event) event.preventDefault()
    if (this.lock()) document.body.classList.toggle('is-menu-visible')
  }
  
  Menu.prototype.handleInnerClick = function(event) {
    event.stopPropagation()
  }
  
  Menu.prototype.handleBodyKeydown = function(event) {
    if (event.keyCode == 27) this.hide() // ESC
  }

  // Bootstrap
  Menu.bootstrap = function() {
    return Array.from(document.querySelectorAll('.site-menu'))
      .map(function(menu) { return new Menu(menu) })
  }
})(window, document);
