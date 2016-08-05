class AddEmailToSplunkUsers < ActiveRecord::Migration
  def change
    add_column :splunk_users, :email, :string
  end
end
