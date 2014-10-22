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
    redirect MainController.r(:index)
  end
end