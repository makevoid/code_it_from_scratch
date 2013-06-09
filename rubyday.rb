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
  
  set :public_dir, "."
  
  set server: 'thin'
  
  @@stream = nil
  
  get '/stream', provides: 'text/event-stream' do
    stream :keep_open do |out|
      EventMachine::PeriodicTimer.new(0.1) {
        if @@stream
          out << "data: #{@@stream}\n\n"
          @@stream = nil
        end
      }
    end
  end
  
  post '/stream' do
    @@stream = params[:direction]
    204 # response without entity body
  end
  
  get "/" do
    File.read "./index.html"
  end
  
  get "/presenter" do
    File.read "./presenter.html"
  end
  
  get "/slides.json" do
    parse_slides File.read "./slides.textile"
  end
end