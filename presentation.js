
var presentation = {
  slides_elem: document.querySelector(".slides"),
  slides: [],
  idx: 0
}

presentation.load = function(slides) {
  this.slides = slides
  var slide = 0
  
  if (location.hash) {
    var hslide = location.hash.substr(1)
    hslide = parseInt(hslide)
    if (hslide < slides.length)
      slide = hslide
  }
  
  this.load_slide(slide)
}

presentation.load_slide = function(idx) {
  var content = this.slides[idx]
  content = textile(content)
  this.slides_elem.innerHTML = content
  this.idx = idx
  location.hash = idx
}

presentation.prev = function() {
  if (this.idx > 0)
    this.load_slide(this.idx-1)
}

presentation.next = function() {
  if (this.idx < this.slides.length-1)  
    this.load_slide(this.idx+1)
}

var request = new XMLHttpRequest()
request.on_success(function(){
  var slides = JSON.parse( request.responseText )
  presentation.load(slides)
})
request.get("/slides.json")

var handle_keyboard = function(evt) {
  if (evt.keyCode == 37)
    presentation.prev()

  if (evt.keyCode == 39)    
    presentation.next()
}

window.addEventListener("keydown", handle_keyboard)

var source = new EventSource('/stream')
source.onmessage = function (event) {
  // console.log("got message: "+event.data)
  
  if (event.data == "next")
    presentation.next()
    
  if (event.data == "prev")
    presentation.prev()
}


var button = document.querySelector("button.fullscreen")
button.addEventListener("click", function(){
  document.documentElement.mozRequestFullScreen()
})