Sequel.migration do
  change do
    add_column :xp, :estimated_time, Integer, :null=>false
    add_column :xp, :catch_phrase, String
    add_column :xp, :desc, String
    self[:xp].insert(name: "Doodle Jump", estimated_time: 150)
  end
end