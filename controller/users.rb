class Users < Controller
  map '/user'

  def login
    if request.post?
      # Form has been posted, let's try to authenticate the user
      # with the supplied credentials
      if user_login(request.subset(:email, :password))
        redirect_referrer
      else
        flash[:danger] = "Email ou mot de passe invalide."
      end
    else
      @section = "connexion"
    end
  end

  def logout
    user_logout
    session.resid!
    flash[:success] = "Vous êtes maintenant déconnecté."
    redirect MainController.r(:index)
  end

  def signup
    if request.post? and !logged_in?
      if request.params['password'] == request.params['password_confirm']
        begin
          User.create(request.subset(:email, :password, :age, :laterality, :believer, :sex))
          if user_login(request.subset(:email, :password))
            redirect_referrer
          else
            redirect Users.r(:signup)
          end
        rescue => e
          flash[:danger] = "Erreur lors de la création du compte : #{e.message}"
        end
      else
        flash[:warning] = "Password et confirmation pas egaux."
        redirect Users.r(:signup)
      end
    else
      @section = "inscription"
    end
  end
end