class RemoveSplunkuseridFromInputLog < ActiveRecord::Migration
  def change
    remove_column :input_logs, :splunk_user_id, :integer
  end
end
