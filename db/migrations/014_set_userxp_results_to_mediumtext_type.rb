Sequel.migration do
  change do
    alter_table(:user_xp) do
      set_column_type :results, :mediumtext
    end
  end
end