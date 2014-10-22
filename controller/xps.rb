class Xps < Controller
	map '/xp'

	layout :default
	set_layout nil => [ :ajax_load, :end ]
	def index
		@xps = Xp.all
	end

	def start(id)
		@xp = Xp.first(id)
		if @xp.nil?
			flash[:warning] = 'Expérience inexistante'
			redirect MainController.r(:index)
		end
	end

	def ajax_load(id)
		@xp = Xp.first(id)
		if !@xp.nil?
			view_sym = @xp.name.gsub(/\s+/, "_").downcase.to_sym
			render_view view_sym
		end
	end
end