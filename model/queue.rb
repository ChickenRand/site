
## I Should probably use something like Redis for this...
class Queue
  @@list = []
  @@last_id = 0

  def self.get_estimated_time(item_id=@@list.length-1)
    estimated_time = 0
    @@list.each_index do |index|
      item = @@list[index]
      if item[:start]
        current_time = Time.now - item[:start_time]
        if current_time > Xp[item[:xp_id]].estimated_time
          estimated_time += current_time
        else
          estimated_time += Xp[item[:xp_id]].estimated_time - current_time
        end
      else
        estimated_time += Xp[item[:xp_id]].estimated_time
      end
      break if item_id == index
    end
    return estimated_time
  end

  def self.get_state
    state = {length: @@list.length}
    state[:estimated_time] = self.get_estimated_time()
    return state
  end

  def self.add_to_queue(xp_id)
    id = @@last_id
    item = {id: id, xp_id: xp_id, start: false, last_check: Time.now}
    @@list.push(item)
    @@last_id = @@last_id + 1
    return item
  end

  def self.get_queue_item(item_id)
    index = @@list.rindex{|item| item[:id] == item_id}
    return nil if index.nil?
    item = @@list[index]
  end

  def self.remove_from_queue(item_id)
    index = @@list.rindex{|item| item[:id] == item_id}
    return nil if index.nil?
    @@list.delete(@@list[index])
    @@list[0][:time_on_top] = Time.now if index == 0
  end

  def self.update_queue_item(item_id)
    item = self.get_queue_item(item_id)
    return nil if item.nil?
    item[:last_check] = Time.now
    item[:estimated_time] = self.get_estimated_time(item_id)
  end

  def self.start_experiment(item_id)
    puts "Item id = #{item_id} list=#{@@list}"
    index = @@list.rindex{|item| puts "looking to =#{item} #{item[:id].class} and #{item_id.class}";item[:id] == item_id}
    puts "index=#{index}"
    return nil if index.nil? or index != 0
    item = @@list[index]
    item[:start] = true
    item[:start_time] = Time.now
  end

  def self.check_inactive_items()
    now = Time.now
    @@list.each do |item|
      if now - item[:last_check] > 30.0
        puts "deleting an item"
        @@list.delete(item)
      elsif item[:time_on_top] and now - item[:time_on_top] > 30.0
        puts "deleting an item"
        @@list.delete(item)
      end
    end
  end
end