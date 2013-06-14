// textism

var textism = function(string) {

  var parse_notes_and_styles = function(string) {
    var notes_regex1 = />&gt; (.+)/g
    // var notes_regex2 = /}&gt; (.+)</g
    var text = string.replace(notes_regex1, '>')
    var text = string.replace(notes_regex1, '>')
    var notes
    if (match = />&gt; (.+)</g.exec(string)) {
      notes = match[1]
      // console.log(match[1])
      // console.log(match[2])
    }
    object = {}
    object.text = text
    object.notes = notes
    object.layout = null
    return object
  }
  
  var parse_code_blocks = function(str) {
    str = str.replace(/```(\w+)\s*\n/g, "<pre><code data-language='$1'>")
    str = str.replace(/```/g, "</code></pre>")
    return str
  }
  
  string = parse_code_blocks(string)
  string = textile(string)
  
  var object = parse_notes_and_styles(string)
  
  return object
}


// main

var presentation = {
  slides_elem: document.querySelector(".slides"),
  notes_elem: document.querySelector(".notes"),
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
  content = textism(content)
  this.slides_elem.innerHTML = content.text
  this.notes_elem.innerHTML = content.notes || ""
  this.idx = idx
  location.hash = idx
  Rainbow.color()
}

presentation.prev = function() {
  if (this.idx > 0)
    this.load_slide(this.idx-1)
}

presentation.next = function() {
  if (this.idx < this.slides.length-1)  
    this.load_slide(this.idx+1)
}

presentation.toggle_notes = function() {
  var style = this.notes_elem.style
  if (style.display == "block")
    style.display = "none"
  else
    style.display = "block"
}

var request = new XMLHttpRequest()
request.on_success(function(){
  var slides = JSON.parse( request.responseText )
  presentation.load(slides)
})
request.get("/slides.json")

var handle_keyboard = function(evt) {
  if (evt.keyCode == 37) // left arrow
    presentation.prev()

  if (evt.keyCode == 39) // right arrow   
    presentation.next()
    
  if (evt.keyCode == 78) // n
    presentation.toggle_notes()
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