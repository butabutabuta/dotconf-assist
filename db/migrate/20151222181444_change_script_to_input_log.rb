class ChangeScriptToInputLog < ActiveRecord::Migration
  def up
  	execute("alter table input_logs modify script mediumblob")
  end

  def down
  	execute("alter table input_logs modify script blob")
  end
end
