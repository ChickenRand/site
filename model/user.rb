#coding: utf-8
require 'bcrypt'

class User < Sequel::Model(:user)
  plugin :validation_helpers
  many_to_many :tokens, :left_key => :user_id, :right_key => :token_id, :join_table => :token_user

  def self.authenticate(credentials)
    u = User.first(email: credentials['email'])
    credentials if !u.nil? and u.password == credentials['pass']
  end

  def validate
    super
    validates_presence [:email, :password]
    validates_unique :email
  end

  def password
    BCrypt::Password.new(super)
  end

  # Utilise l'algorithme BCrypt pour hasher le mot de passe
  def password= (pass)
    super(BCrypt::Password.create(pass))
  end
end