Sequel.migration do
  change do
    alter_table(:user_xp) do
      set_column_type :results, String, text: true
    end
  end
end