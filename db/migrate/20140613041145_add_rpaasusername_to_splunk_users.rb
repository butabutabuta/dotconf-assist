class AddRpaasusernameToSplunkUsers < ActiveRecord::Migration
  def change
    add_column :splunk_users, :rpaas_user_name, :string
  end
end
