require 'net/http'

class Xps < Controller
  map '/xp'

  layout :default
  set_layout nil => [ :ajax_load, :questionnaire, :send_results, :send_questionnaire_results, :end_xp, :end_xp_problem ]

  before :start do
    if !logged_in?
      if request.xhr?
        respond!({message: "Vous devez être connecté pour participer aux expériences."}.to_json, 401, 'Content-Type' => 'application/json')
      else
        flash[:warning] = "Vous devez être connecté pour participer aux expériences."
        redirect Xps.r(:index)
      end
    end

    if ENV['MAINTENANCE_MODE']
      redirect Xps.r(:maintenance_mode)
    end
    @section = "xp"
  end

  def index
    @xps = Xp.all
    @title = "Expérience"
  end

  def start(id)
    @xp = Xp[id]
    if @xp.nil?
      flash[:warning] = 'Expérience inexistante'
      redirect MainController.r(:index)
    else
      @title = @xp.name
      @xp_desc = File.read("./view/xp/" + xp_file_name() + "_desc.xhtml")
    end
  end

  def xp_file_name
    @xp.name.gsub(/\s+/, "_").downcase
  end

  # Dynamically load the view for the experiment
  def ajax_load(id)
    @xp = Xp[id]
    if !@xp.nil?
      view_sym = xp_file_name().to_sym
      render_view view_sym
    end
  end

  def generate_control_xp(user_id, xp_id)
      rng_control_url = ENV['RNG_CONTROL_URL'].nil? ? 'localhost:1337' : ENV['RNG_CONTROL_URL']
      uri = URI("http://#{rng_control_url}/rng-control?user_id=#{user_id}&xp_id=#{xp_id}")
      begin
        response = Net::HTTP.get(uri)
      rescue StandardError => e
        Ramaze::Log.error("Problem calling rng-control")
      end
  end

  # RNG send directly it's raw binary data for each xp done
  def send_raw_data(user_xp_id)
    ux = UserXp[user_xp_id]
    if !user_xp_id.nil?
      begin
        ux.update(:raw_data=> ::Sequel::SQL::Blob.new(request.body.read()))
      rescue Mysql2::Error => e
        Ramaze::Log.error(e.message)
      end
    end
  end

  def send_questionnaire_results(user_xp_id)
    ux = UserXp[user_xp_id]
    if !user_xp_id.nil?
      begin
        ux.update_fields({
            music: request.params["music"],
            drug: request.params["drug"],
            concentration_level: request.params["concentration_level"],
            alone: request.params["alone"]
          }, [:music, :drug, :concentration_level, :alone])
      rescue Mysql2::Error => e
        Ramaze::Log.error(e.message)
      end
    end
  end

  # Save experiments results
  def send_results(id)
    results = request.params["results"]
    if logged_in? and !results.nil? and !Xp[id].nil?
      # RNG Control post data with the user who've done the active XP, this way we can have control for each user
      # Though, I don't know if it will be usefull :)
      rng_control = request.params["rng_control_user_id"]
      user_id = if !rng_control.nil? then rng_control else user['id'] end
      begin
        ux = UserXp.create do |r|
          r.user_id = user_id
          r.xp_id = id
          r.xp_time = Time.now
          r.results = results
          r.rng_id = request.params["rng_id"]
        end
      rescue Mysql2::Error => e
        Ramaze::Log.error(e.message)
      end
      if rng_control.nil?
        # Immediatly generate control results based on the same amount of time and linked to the same user and xp
        generate_control_xp(ux.user_id, ux.xp_id)
      end
      # return user_xp.id which will be usefull
      ux.id
    else
      msg = if !logged_in? then "Erreur : Vous devez être connecté." else "Erreur pas de résultat." end
      respond!({message: msg}.to_json, 401, 'Content-Type' => 'application/json')   
    end
  end

  def end_xp_problem
    Ramaze::Log.error("Someone has finish the experiments but had problems with the rng")
  end
end
