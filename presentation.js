
var presentation = {
  slides_elem: document.querySelector(".slides"),
  slides: [],
  idx: 0
}

presentation.load = function(slides) {
  this.slides = slides
  this.load_slide(0)
}

presentation.load_slide = function(idx) {
  content = this.slides[idx]
  content = textile(content)
  this.slides_elem.innerHTML = content
  this.idx = idx
}

presentation.prev = function() {
  if (this.idx > 0)
    this.load_slide(this.idx-1)
}

presentation.next = function() {
  if (this.idx < this.slides.length-1)  
    this.load_slide(this.idx+1)
}

request = new XMLHttpRequest()
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

// TODO: history.state

var source = new EventSource('/stream')
source.onmessage = function (event) {
  if (event.data == "next")
    presentation.next()
    
  if (event.data == "prev")
    presentation.prev()
}
