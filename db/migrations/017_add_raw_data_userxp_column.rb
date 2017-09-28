Sequel.migration do
  change do
    add_column :user_xp, :raw_data, File, size: 16777215 # Need to force MEDIUMBLOB type
  end
end