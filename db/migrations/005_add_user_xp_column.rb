Sequel.migration do
  change do
    add_column :user_xp, :xp_time, Time
    add_column :user_xp, :music, String
    add_column :user_xp, :drug, String
    add_column :user_xp, :results, String, :text=>true
    add_column :user_xp, :alone, TrueClass
    alter_table(:user_xp){add_foreign_key :rng_id, :rng}
  end
end