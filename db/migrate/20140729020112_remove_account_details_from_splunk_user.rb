class RemoveAccountDetailsFromSplunkUser < ActiveRecord::Migration
  def change
    remove_column :splunk_users, :user_name, :string
    remove_column :splunk_users, :group_name, :string
    remove_column :splunk_users, :app_team_name, :string
    remove_column :splunk_users, :serviceid, :integer
  end
end
