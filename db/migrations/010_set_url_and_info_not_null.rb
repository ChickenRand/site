Sequel.migration do
  change do
    #I don't know how to do that without droping the columns...
    DB[:user_xp].truncate
    alter_table(:rng) do
      drop_column :url
      drop_column :infos
      add_column :url, String, :null => false
      add_column :infos, String, :null => false
    end
  end
end