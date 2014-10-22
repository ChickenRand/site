#coding: utf-8
require 'securerandom'

class Token < Sequel::Model(:token)
  many_to_many :users, :left_key => :token_id, :right_key => :user_id, :join_table => :token_user

  def before_create
    self.token = SecureRandom.hex
    super
  end
end