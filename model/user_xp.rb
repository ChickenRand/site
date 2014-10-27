class UserXp < Sequel::Model(:user_xp)
  many_to_one :user
  many_to_one :xp
end