Sequel.migration do
  change do
    add_column :xp, :img_url, String
  end
end