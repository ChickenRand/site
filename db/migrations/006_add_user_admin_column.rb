Sequel.migration do
  change do
    add_column :user, :admin, FalseClass
  end
end