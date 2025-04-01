# ChickenRand Ramaze website

Yes I know Ramaze is no longer developed, but I create this website in like 20 hours and needed a tool that I know perfectly.
Ramaze was that tool... it still fullfill my needs but I want to change for Laravel in the future.


## Requirements

In order to run this application you'll need to have Ramaze 2023.01.06 or newer,
Rake and ruby < 3.0. Optionally you can install Bundler and use it for Gem management, this
can be done as following:

    $ rvm pkg install openssl
    $ rvm install ruby-2.7.8 --with-openssl-dir=$rvm_path/usr
	$ rvm use ruby-2.7.8
	$ gem install bundler
    $ bundle install
    $ sequel -m db/migrations/ sqlite://db/chickenrand.sqlite
    $ rackup

Then you need to manually add an admin. I recommand using sequel repl since it use Model and password hash method :

	$ cd site_dir
	$ sequel sqlite://db/chickenrand.sqlite
	$ > require './model/user'
	$ > User.create(:email => 'your@email.com', :password => 'YourPassWordInClear', :admin => true)

You must also create a control user

	$ > User.create(:email => 'control@chickenrand.org', :password => 'ControlPassword')
