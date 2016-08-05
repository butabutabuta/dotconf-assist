class AddSplunkHostsRefToSplunkUsers < ActiveRecord::Migration
  def change
    add_reference :splunk_users, :splunk_host_id, index: true
  end
end
