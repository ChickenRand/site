require 'json'

class QueueController < Controller

  map '/queue'
  layout nil

  provide(:json, :type => 'application/json') do |action, value|
    # "value" is the response body from our controller's method
    value.to_json
  end

  def state
    #Sometime user hit F5 and recall get_state, so we need to give him his item
    item = Queue::get_user_queue_item(user['id'].to_i)
    state = Queue::get_state()
    {item: item, state: state}
  end

  def update(id)
    Queue::update_queue_item(id.to_i)
    Queue::get_state()
  end

  def add(xp_id)
    if(logged_in?)
      item = Queue::add_to_queue(xp_id.to_i, user['id'].to_i)
      if item.nil?
        {message: "Erreur : Utilisateur déjà dans la queue ou Xp inexistante"}
      else
        state = Queue::get_state()
        {item: item, state: state}
      end
    else
      {message: "Erreur : Vous devez être connecté."}
    end
  end

  def remove(id)
    Queue::remove_from_queue(id.to_i)
  end

  def start(id)
    item = Queue::start_experiment(id.to_i)
    if item.nil?
      {message: "Erreur : vous ne pas commencer une expérience si vous n'êtes pas au dessus dans la queue."}
    else
      rng = Rng[status: true]
      if rng.nil?
        {message: "Erreur : Pas de RNG disponibles."}
      else
        rng.values
      end
    end
  end
end