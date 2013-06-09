
// utils

XMLHttpRequest.prototype.get = function(url){
  this.open('GET', url, true)
  this.send(null)
}

XMLHttpRequest.prototype.post = function(url, params){
  this.open('POST', url, true)
  this.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  this.send(params)
}

XMLHttpRequest.prototype.success = function(callback) {
  return function(){ 
    if (request.readyState == 4) { 
      // TODO maybe: request.status === 200
      callback()
    }
  }
}

XMLHttpRequest.prototype.on_success = function(callback) {
  this.onreadystatechange = this.success(callback)
}


// main

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

// TODO: history.state + websocket presenter notes + arrows


var source = new EventSource('/stream')
source.onmessage = function (event) {
  console.log(event.data)
}

request2 = new XMLHttpRequest()
request2.post("/stream", "direction=next")



// class EventSource
//   include EM::Deferrable
// 
//   def send(data, id = nil)
//     data.each_line do |line|
//       line = "data: #{line.strip}\n"
//       @body_callback.call line
//     end
//     @body_callback.call "id: #{id}\n" if id
//     @body_callback.call "\n"
//   end
// 
//   def each(&blk)
//     @body_callback = blk
//   end
// end
