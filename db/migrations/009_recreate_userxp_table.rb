Sequel.migration do
  change do
    drop_table(:user_xp)
    create_table(:user_xp) do
      primary_key :id
      Time :xp_time
      String :music
      String :drug
      String :raw_numbers
      String :results
      TrueClass :alone      
      foreign_key :user_id, :user, :null=>false
      foreign_key :xp_id, :xp, :null=>false
      foreign_key :rng_id, :rng, :null=>false
    end
  end
end