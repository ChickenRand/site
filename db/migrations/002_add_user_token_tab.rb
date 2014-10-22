Sequel.migration do
	change do
		create_table(:token) do
			primary_key :id
			String :token
		end

		create_join_table(:user_id => :user, :token_id => :token) do
		end
	end
end