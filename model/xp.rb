class Xp < Sequel::Model(:xp)
  one_to_many :user_xp
end