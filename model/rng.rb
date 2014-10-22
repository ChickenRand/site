class Rng < Sequel::Model(:rng)
  def validate
    super
    errors.add(:url, 'cannot be empty') if !url || url.empty?
    errors.add(:infos, 'cannot be empty') if !infos || infos.empty?
  end
end