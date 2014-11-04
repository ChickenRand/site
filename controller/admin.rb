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
        WhiteList.create(email: s) if WhiteList.first(email: s).nil?
        begin
          Pony.mail(:to => s, :from => 'admin@chickenrand.com', :subject => 'Invitation', :body => 'Hello, Joe.')
        rescue => e
          flash[:danger] = "Une erreur est survenue pendant l'envoie des mails. #{e.message}"
          redirect AdminController.r(:invite_users)
        end
      end
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
      rng = Rng.create(request.subset(:infos, :url))
      if rng.nil?
        flash[:danger] = "Erreur à la création du rng"
      else
        flash[:success] = "Rng bien créé"
      end
      redirect AdminController.r(:rngs)
    end
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
    @results = UserXp.all
  end

  def get_result(id)
    if(request.xhr?)
      res = UserXp[id]
      if res.nil?
        {message: "Résultat id=#{id} inexistant"}
      else
        res.value
      end
    else
      redirect AdminController.r(:results)
    end
  end

  def delete_result(id)
    res = UserXp[id]
    if res.nil?
      flash[:warning] = "Impossible de supprimer les résultats  : id inexistant"
    else
      begin
        res.delete
      rescue => e
        flash[:error] = e.message
      end
    end
    redirect AdminController.r(:results)
  end
end