class AddIntervalToInputLog < ActiveRecord::Migration
  def change
    add_column :input_logs, :interval, :string
  end
end
