require 'pony'

class AdminController < Controller
  map '/admin'
  layout :default
  set_layout nil => [ :set_rng_status ]

  before_all do
    #if nobody is admin, it means we need to create one
    admin = User.first(admin: true)
    action = request.env['REQUEST_PATH'].split('/').last
    if admin.nil?
      if action != "install"
        redirect AdminController.r(:install)
      end
    else
      redirect_referrer unless logged_in? and user['admin']
    end
    @section="admin"
    @title = "admin"
  end

  provide(:json, :type => 'application/json') do |action, value|
    # "value" is the response body from our controller's method
    value.to_json
  end

  def index
  end

  def install
    #There can only be one admin
    admin = User.first(admin: true)
    if !admin.nil?
      flash[:danger] = "Il ne peut y avoir qu'un admin."
      redirect MainController.r(:index)
    end
    if request.post?
      if request.params['password'] == request.params['password_confirm']
        User.create do |u|
          u.email = request.params['email']
          u.password = request.params['password']
          u.admin = true
        end
        user_login(request.subset(:email, :password))
        redirect AdminController.r(:index)
      else
        flash[:warning] = "Password et confirmation pas egaux"
        redirect AdminController.r(:install)
      end
    end
  end

  def users
    @users = User.all
  end

  def invite_users
    if request.post? and !request.params['emails'].nil?
      request.params['emails'].split(';').each do |s|
        s.strip!
        begin
          WhiteList.create(email: s) if WhiteList.first(email: s).nil?
        rescue => e
          flash[:danger] = "Une erreur est survenue pendant l'ajout de l'email. #{e.message}"
        end
      end
      redirect AdminController.r(:invite_users)
    else
      @white_list = WhiteList.all
    end
  end

  def remove_from_white_list(id)
    email = WhiteList[id]
    if email.nil?
      flash[:warning] = "Email inexistant"
    else
      email.delete
      flash[:success] = "Email bien supprimé"
    end
    redirect AdminController.r(:invite_users)
  end

  def users
    @users = User.all
  end

  def delete_user(id)
    u = User[id]
    if !u.nil? and !u.admin
      begin
        u.delete
      rescue => e
        flash[:error] = e.message
      end
    else
      flash[:warning] = "Impossible de supprimer l'utilisateur  : inexistant ou admin"
    end
    redirect AdminController.r(:users)
  end

  def rngs
    @rngs = Rng.all
  end

  def add_rng
    if request.post?
      begin
        rng = Rng.create(request.subset(:infos, :url))
        if rng.nil?
          flash[:danger] = "Erreur à la création du rng"
        else
          flash[:success] = "Rng bien créé"
        end
      rescue => e
        flash[:danger] = "Erreur lors de la création du Rng #{e.message}"
      end
    end
    redirect AdminController.r(:rngs)
  end

  def delete_rng(id)
    rng = Rng[id]
    if rng.nil?
      flash[:warning] = "Rng inexistant"
    else
      begin
        rng.delete
        flash[:success] = "Rng supprimé"
      rescue => e
        flash[:danger] = "Erreur lors de la suppression du Rng #{e.message}"
      end
    end
    redirect AdminController.r(:rngs)
  end

  def xps
    @xps = Xp.all
  end

  def add_xp
    if request.post?
      begin
        if !request.params['id'].nil? and request.params['id'] != ""
          xp = Xp[request.params['id']]
          xp.update(request.subset(:name, :estimated_time, :catch_phrase, :desc, :img_url))
          flash[:success] = "Xp bien modifiée"
        else
          xp = Xp.create(request.subset(:name, :estimated_time, :catch_phrase, :desc, :img_url))
          flash[:success] = "Xp bien créée"
        end
      rescue => e
        flash[:danger] = "Erreur lors de la création de l'XP #{e.message}"
      end
    end
    redirect AdminController.r(:xps)
  end

  def delete_xp(xp_id)
    xp = Xp[xp_id]
    if xp.nil?
      flash[:warning] = "Xp inexistante"
    else
      begin
        xp.delete
        flash[:success] = "Xp supprimée"
      rescue => e
        flash[:danger] = "Erreur lors de la suppression de l'XP #{e.message}"
      end
    end
    redirect AdminController.r(:xps)
  end

  def set_rng_status(rng_id)
    rng = Rng[rng_id]
    if !rng.nil?
      rng.status = request.params['status']
      begin
        rng.save
        {message: "OK"}
      rescue => e
        {message: "Erreur : #{e.message}"}
      end
    end
  end

  def results
    # We want to have one row per couple xp and control xp
    @results = UserXp.exclude(Sequel.like(:results, '%rng_control%'))
  end

  def get_result(id)
    res = UserXp[id]
    if res.nil?
      {message: "Résultat id=#{id} inexistant"}
    else
      res.values
    end
  end

  def get_raw_results(xp_name = nil)
    xp = Xp[name: xp_name]
    if xp.nil? and xp_name
      {message: "Xp inexistante"}
    else
      results = UserXp.where(xp_id: xp.id).naked.all
    end
  end

  def get_raw_results_fountain()
    get_raw_results("The Fountain")
  end

  def get_diff_ones_xp(xp_name = nil)
    xp = Xp[name: xp_name]
    if xp.nil? and xp_name
      {message: "Xp inexistante"}
    else
      graph_data = {diff_ones_active: [], diff_ones_control: []}
      current_key = :diff_ones_active
      total_diffs = {diff_ones_active: 0, diff_ones_control: 0}
      nb_time = 0
      results_count = 0
      if xp_name.nil?
        results = UserXp.all
        results_count = UserXp.all.count
      else
        results = UserXp.where(xp_id: xp.id)
        results_count = UserXp.where(xp_id: xp.id).count
      end
      total_trials = (xp.estimated_time * 10) * (results_count / 2) # /2 because there is control and active xp
      nb_trials_per_graph_data = total_trials / 100 # We only want the graph line to have 100 points for readability
      results.each do |r|
        begin
          parsed_results = JSON.parse(r.results)
          current_key = parsed_results['rng_control'] ? :diff_ones_control : :diff_ones_active
          parsed_results["trials"].each do |t|
            if nb_time < nb_trials_per_graph_data then
              total_diffs[current_key] += ((t["nbOnes"] + t["nbZeros"]) / 2) - t["nbZeros"]
              nb_time += 1
            else
              graph_data[current_key].push(total_diffs[current_key])
              nb_time = 0
            end
          end
        rescue => e
          puts e.message
        end
      end
      graph_data[current_key].push(total_diffs[current_key]) if(nb_time != 0)
      graph_data
    end
  end

  def get_diff_ones_doodle
    get_diff_ones_xp("Doodle Jump")
  end

  def get_diff_ones_fountain
    get_diff_ones_xp("The Fountain")
  end

  def get_diff_ones_total
    get_diff_ones_xp()
  end

  # Renvoie le nombre de 1 en fonction du score dans le Jeu
  def get_diff_ones_points_doodle
    xp = Xp[name: "Doodle Jump"]
    if xp.nil?
      {message: "Xp inexistante"}
    else
      diff_ones = []
      40.times do
        diff_ones.push({total: 0, nb: 0})
      end
      results = UserXp.where(xp_id: xp.id)
      results.each do |r|
        begin
          parsed_results = JSON.parse(r.results)
          parsed_results["trials"].each do |t|
            score = t["gameScore"]
            tabInd = score / 100
            #The score can be -1 if game over so we add one
            diff_ones[tabInd + 1][:total] += 100 - t["nbOnes"]
            diff_ones[tabInd + 1][:nb] += 1
          end
        rescue => e
          puts e.message
        end
      end
      diff_ones.each_index do |i|
        if diff_ones[i][:nb] > 0
          diff_ones[i] = diff_ones[i][:total] / diff_ones[i][:nb]
        else
          diff_ones[i] = 0
        end
      end
      diff_ones
    end
  end

  def delete_result(id)
    res = UserXp[id]
    if res.nil?
      flash[:warning] = "Impossible de supprimer les résultats  : id inexistant"
    else
      begin
        # Also delete control data linked to this result
        if not res.control_user_xp.nil?
          res.control_user_xp.delete
        end
        res.delete
      rescue => e
        flash[:error] = e.message
      end
    end
    redirect AdminController.r(:results)
  end

  def delete_all_results
    DB[:user_xp].truncate
    redirect AdminController.r(:results)
  end
end