---
---

/*
	Forty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

{% include_relative lib/waypoints.min.js %}

{% include_relative components/site-header.js %}
{% include_relative components/menu.js %}
{% include_relative components/tile.js %}

function setup() {
	window.addEventListener('load', function() {
	  setTimeout(function() {
	    document.documentElement.classList.remove('is-loading')
	  }, 1)
	})
	window.addEventListener('unload', function() {
	  setTimeout(function() {
	    Array.from(document.querySelectorAll('.is-transitioning')).forEach(function(el) {
	      el.classList.remove('is-transitioning')
	    })
	  }, 250)
	})
	
	SiteHeader.bootstrap()
	Menu.bootstrap()
	Tile.bootstrap()
}

document.addEventListener('DOMContentLoaded', setup)
