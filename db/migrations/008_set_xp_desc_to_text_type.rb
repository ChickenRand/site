Sequel.migration do
  change do
    alter_table(:xp) do
      set_column_type :desc, String, text: true
    end
  end
end