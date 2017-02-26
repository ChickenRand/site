#coding: utf-8
require 'bcrypt'


Sequel.migration do
  change do
    self[:xp].insert(name: "The fountain", estimated_time: 30)
    if(ENV['ADMIN_EMAIL'] and ENV['ADMIN_PASSWORD']) then
    	self[:user].insert(email: ENV['ADMIN_EMAIL'], password: BCrypt::Password.create(ENV['ADMIN_PASSWORD']), admin: true)
    end
    if(ENV['CONTROL_PASSWORD']) then
    	self[:user].insert(email: 'control@chickenrand.org', password: BCrypt::Password.create(ENV['CONTROL_PASSWORD']))
    end
  end
end