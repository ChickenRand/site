Sequel.migration do
  change do
    add_column :user_xp, :concentration_level, Integer
  end
end