# Just took the numbers data of user_xp which are json based, translate them back to binary
# and save them to a file which can be give to rngtest (or othe statistical analysis tools).
require 'ramaze'
require 'sequel'
require 'json'
require 'bindata'

require 'config/database'
require 'model/init'

File.open('user_xp_data.bin', 'wb') do |io|
	UserXp.each do |xp|
		res = JSON.parse(xp.results)
		res['trials'].each do |trials|
			arr = BinData::Array.new(:type => :uint8)
			arr.assign(trials['numbers'])
			arr.write(io)
		end
	end
end