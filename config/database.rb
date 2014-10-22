require 'logger'

if(ENV['DATABASE_URL'])
  DB = Sequel.connect(ENV['DATABASE_URL'])
else
  DB = Sequel.mysql2(
    'psi_rng',
    :user=>'root',
    :password=>'root',
    :charset=>'utf8')
end

Sequel.extension(:migration)

#Uncomment this if you want to log all DB queries
#DB.loggers << Logger.new($stdout)
