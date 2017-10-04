class Results < Controller
  map '/results'
  layout :default

  before_all do
    @section="results"
  end

  set_layout nil => [:get_results]

  provide(:json, :type => 'application/json') do |action, value|
    # "value" is the response body from our controller's method
    value.to_json
  end

  def index
    @title = "Mes résultats"
  end

  def get_results(user_id)
    if !user_id.nil?
      # Select everything except raw_data
      col = DB[:user_xp].columns
      col.delete(:raw_data)
      DB[:user_xp].select{col}.where(user_id: user_id).all
    else
      []
    end
  end
end