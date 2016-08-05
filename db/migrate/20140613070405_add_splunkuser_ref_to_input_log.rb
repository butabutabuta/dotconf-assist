class AddSplunkuserRefToInputLog < ActiveRecord::Migration
  def change
    add_reference :input_logs, :splunk_users, index: true
  end
end
