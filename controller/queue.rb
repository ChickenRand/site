require 'json'

class QueueController < Controller

  map '/queue'
  layout nil

  provide(:json, :type => 'application/json') do |action, value|
    # "value" is the response body from our controller's method
    value.to_json
  end

  def state
    Queue::get_state()
  end

  def update(id)
    Queue::update_queue_item(id)
    Queue::get_state()
  end

  def add(xp_id)
    item = Queue::add_to_queue(xp_id)
    state = Queue::get_state()
    {item: item, state: state}
  end

  def remove(id)
    Queue::remove_from_queue(id)
  end

  def start(id)
    item = Queue::start_experiment(id.to_i)
    if item.nil?
      {message: "Erreur : vous ne pas commencer une expérience si vous n'êtes pas au dessus de la pile."}
    else
      Rng.first
    end
  end
end