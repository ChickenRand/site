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

# Avoid "Mysql2::Error::ConnectionError: MySQL server has gone away" on o2switch
# See http://sequel.jeremyevans.net/rdoc-plugins/files/lib/sequel/extensions/connection_validator_rb.html for more info
DB.extension(:connection_validator)

#Uncomment this if you want to log all DB queries
#DB.loggers << Logger.new($stdout)
