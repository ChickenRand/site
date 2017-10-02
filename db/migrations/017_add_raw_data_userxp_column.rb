Sequel.migration do
  change do
    # Note that size parameter doesn't work.
    # It is necessary to manually change raw_data column type from BLOB to MEDIUMBLOB type
    add_column :user_xp, :raw_data, File, size: 16777215
  end
end