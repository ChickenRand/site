class Users < Controller
  map '/user'

  def create

  end

  def login
    if request.post?
      # Form has been posted, let's try to authenticate the user
      # with the supplied credentials
      if user_login(request.subset(:email, :pass))
        redirect MainController.r(:index)
      end
    end
  end

  def logout
    user_logout
    session.resid!
    redirect MainController.r(:index)
  end
end