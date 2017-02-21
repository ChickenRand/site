# ChickenRand Ramaze website

Yes I know Ramaze is no longer developed, but I create this website in like 20 hours and needed a tool that I know perfectly.
Ramaze was that tool... it still fullfill my needs but I want to change for Laravel in the future.

## Requirements

In order to run this application you'll need to have Ramaze 2.0.0 or newer and
Rake. Optionally you can install Bundler and use it for Gem management, this
can be done as following:

If there is a problem during EventMachine compilation, edit Gemfile.lock and use 1.0.4 instead of 1.0.3

    $ gem install bundler
    $ bundle install
    $ sequel -m db/migrations/ mysql2://user:password@server_addr/psi_rng
    $ rake server:start

Then you need to manually add an admin. I recommand using sequel repl since it use Model and password hash method :

	$ cd site_dir
	$ sequel mysql2://user:password@server_addr/psi_rng
	$ > require './model/user'
	$ > User.create(:email => 'your@email.com', :password => 'YourPassWordInClear', :admin => true)
