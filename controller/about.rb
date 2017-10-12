class About < Controller
  map '/about'
  layout :default

  before_all do
    @section="about"
  end

  def index
    @title = "À propos"
  end
end