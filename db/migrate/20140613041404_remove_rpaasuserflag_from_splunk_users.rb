class RemoveRpaasuserflagFromSplunkUsers < ActiveRecord::Migration
  def change
    remove_column :splunk_users, :rpaas_user_flg, :string
  end
end
