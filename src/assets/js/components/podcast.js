;(function(window, document) {
  window.Podcast = function(el) {
    this.el = el
    this.title = this.el.querySelector('.podcast-title')
    this.button = this.el.querySelector('.podcast-toggle')
    
    this.progress = this.el.querySelector('.podcast-progress')
    this.currentTime = this.progress.querySelector('.podcast-current-time')
    this.length = this.progress.querySelector('.podcast-length')
    this.meter = this.progress.querySelector('.podcast-meter')
    this.fill = this.meter.querySelector('.podcast-meter-fill')
    
    this.toggle = this.toggle.bind(this)
    this.onEnded = this.onEnded.bind(this)
    this.onLoadedMetadata = this.onLoadedMetadata.bind(this)
    this.onUpdateTime = this.onUpdateTime.bind(this)
    this.onMeterClick = this.onMeterClick.bind(this)
    this.onRssFetch = this.onRssFetch.bind(this)
    this.onError = this.onError.bind(this)
    
    this.button.addEventListener('click', this.toggle)
    this.fetchRss()
  }

  Podcast.prototype.fetchRss = function() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', this.el.dataset.feedUrl, true)
    const self = this
    xhr.onload = function (event) {
      if (xhr.readyState !== 4) return
      if (xhr.status === 200) self.onRssFetch(xhr.responseXML)
      else self.onError(event)
    }
    xhr.onerror = this.onError
    xhr.send(null)
  }
  
  Podcast.prototype.onRssFetch = function(doc) {
    const self = this
    const item = Array.from(doc.querySelectorAll('channel item'))
      .find(function(item) {
        const link = item.querySelector('link')
        return link && link.textContent == self.el.dataset.anchorUrl
      })
    const src = item.querySelector('[type^="audio"]'),
      audioUrl = src && src.getAttribute('url')
    if (!audioUrl) this.onError()
  
    // Build audio element
    this.title.innerHTML = item.querySelector('title').textContent
    
    this.audio = document.createElement('audio')
    this.audio.addEventListener('timeupdate', this.onUpdateTime)
    this.audio.onloadedmetadata = this.onLoadedMetadata
    this.audio.onended = this.onEnded
    
    this.source = document.createElement('source')
    this.source.setAttribute('src', audioUrl)
    this.audio.appendChild(this.source)
    this.el.appendChild(this.audio)
  }
  
  Podcast.prototype.formatTime = function(time) {
    const minute = parseInt(time / 60) % 60
    const secondsLong = time % 60
    const seconds = secondsLong.toFixed()
    return `${minute}:${seconds < 10 ? `0${seconds}` : seconds}`
  }
  
  Podcast.prototype.onMeterClick =  function(event) {
    const percent = event.offsetX / event.target.offsetWidth
    this.audio.currentTime = percent * this.audio.duration
  }
  
  Podcast.prototype.toggle = function(event) {
    event.preventDefault()
    if (this.audio.paused === false) {
      this.audio.pause()
      this.el.classList.remove('paused')
    } else {
      this.audio.play().then(console.log).catch(console.error)
      this.el.classList.add('paused')
    }
  }
  
  Podcast.prototype.onEnded = function() {
    this.el.classList.remove('paused')
    this.fill.style.width = 0;
    this.currentTime.innerHTML = '0:00';
  }
  
  Podcast.prototype.onLoadedMetadata = function(event) {
    this.length.innerHTML = this.formatTime(this.audio.duration)

    if (!this._initProgress) {
      this.meter.addEventListener('click', this.onMeterClick)
      this._initProgress = true
    }
  }
  
  Podcast.prototype.onUpdateTime = function() {
    this.currentTime.innerHTML = this.formatTime(this.audio.currentTime)
    const percent = (this.audio.currentTime / this.audio.duration).toFixed(2) * 100;
    this.fill.style.width = `${percent}%`;
  }
  
  Podcast.prototype.onError = function(event) {
    this.el.classList.add('did-error')
  }

  // Bootstrap
  Podcast.bootstrap = function() {
    return Array.from(document.querySelectorAll('.podcast'))
      .map(function(header) { return new Podcast(header) })
  }
})(window, document);
