require 'bundler/setup'
Bundler.require :default
require 'json'

# utils

module TextileSlides
  def parse_slides(contents)
    slides = []
    slides += contents.split "---"
    slides.to_json
  end
end


# app

class Rubyday < Sinatra::Base
  include TextileSlides
  
  set :public, "."
  
  get "/" do
    File.read "./index.html"
  end
  
  get "/slides.json" do
    parse_slides File.read "./slides.textile"
  end
end