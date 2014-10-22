Sequel.migration do
  change do
    add_column :rng, :infos, String
  end
end