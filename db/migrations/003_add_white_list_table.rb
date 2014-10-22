Sequel.migration do
	change do
		create_table(:white_list) do
			primary_key :id
			String :email, :null=>false, :unique=>true
		end
	end
end