require 'pony'

class AdminController < Controller
  map '/admin'

  def index
    #if nobody is admin, it means we need to create one
    admin = User.first(admin: true)
    if admin.nil?
      redirect AdminController.r(:install)
    end
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

  def delete_user(id)
    u = User[id]
    if !u.nil? and !u.admin
      u.delete
      redirect AdminController.r(:index)
    else
      flash[:warning] = "Impossible de supprimer l'utilisateur  : inexistant ou admin"
    end
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
      rng.delete
      flash[:success] = "Rng supprimé"
    end
    redirect AdminController.r(:rngs)
  end

  def xps
    @xps = Xp.all
  end
end