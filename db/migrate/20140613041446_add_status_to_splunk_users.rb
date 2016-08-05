class AddStatusToSplunkUsers < ActiveRecord::Migration
  def change
    add_column :splunk_users, :status, :integer
  end
end
