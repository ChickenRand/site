Sequel.migration do
  change do
    DB[:user_xp].each do |xp|
      begin
        JSON.parse(xp[:results])
      rescue => e
        #If there is an error, it means that the results are truncate
        ind = xp[:results].rindex(",{")
        if !ind.nil?
          puts "Fix result id #{xp[:id]}"
          xp[:results] = xp[:results][0, ind] + "]}"
          from(:user_xp).filter(id: xp[:id]).update(results: xp[:results])
        end
      end
    end
  end
end