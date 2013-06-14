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