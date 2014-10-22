class Users < Controller
  map '/user'

  def create

  end

  def login
    if request.post?
      # Form has been posted, let's try to authenticate the user
      # with the supplied credentials
      if user_login(request.subset(:email, :password))
        redirect MainController.r(:index)
      else
        flash[:danger] = "Email ou mot de passe invalide."
      end
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
        email = WhiteList[email: request.params['email']]
        if email.nil?
          flash[:danger] = "Cet email n'a pas reçu d'invitation, vous ne pouvez pour l'instant pas créer de compte avec."
          redirect Users.r(:signup)
        else
          begin
            User.create(request.subset(:email, :password, :age, :laterality, :believer, :sex))
          rescue => e
            flash[:danger] = "Erreur lors de la création du compte : #{e.message}"
          end
        end
      else
        flash[:warning] = "Password et confirmation pas egaux."
        redirect Users.r(:signup)
      end
    end
  end
end