class AddSplunkUserNameToAuthentication < ActiveRecord::Migration
  def change
    add_column :authentications, :splunk_user_name, :string
  end
end
