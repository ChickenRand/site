class Xps < Controller
  map '/xp'

  layout :default
  set_layout nil => [ :ajax_load, :questionnaire ]
  def index
    @xps = Xp.all
  end

  def start(id)
    @xp = Xp[id]
    if @xp.nil?
      flash[:warning] = 'Expérience inexistante'
      redirect MainController.r(:index)
    end
  end

  # Dynamically load the view for the experiment
  def ajax_load(id)
    @xp = Xp[id]
    if !@xp.nil?
      view_sym = @xp.name.gsub(/\s+/, "_").downcase.to_sym
      render_view view_sym
    end
  end

  #Save experiments results
  def send_results(id)
    results = request.params["results"]
    if logged_in? and !results.nil? and !Xp[id].nil?
      res = UserXp.create do |r|
        r.user_id = user['id']
        r.xp_id = id
        r.xp_time = Time.now
        r.music = request.params["music"]
        r.drug = request.params["drug"]
        r.results = results
        r.alone = request.params["alone"]
        r.rng_id = request.params["rng_id"]
      end
    end
  end
end