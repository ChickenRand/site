class UserXp < Sequel::Model(:user_xp)
  many_to_one :user
  many_to_one :xp

  def control_user_xp
    current_id = self.id
    user_id = self.user.id
    UserXp.first{Sequel.&(Sequel.like(:results, '%rng_control%'), {user_id: user_id}, (id > current_id))}
  end
end