class AddSplunkHostRefToSplunkUsers < ActiveRecord::Migration
  def change
    add_reference :splunk_users, :splunk_host, index: true
  end
end
