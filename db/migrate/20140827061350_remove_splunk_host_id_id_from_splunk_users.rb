class RemoveSplunkHostIdIdFromSplunkUsers < ActiveRecord::Migration
  def change
    remove_column :splunk_users, :splunk_host_id_id, :int
  end
end
