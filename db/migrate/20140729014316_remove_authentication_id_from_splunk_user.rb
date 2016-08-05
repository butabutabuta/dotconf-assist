class RemoveAuthenticationIdFromSplunkUser < ActiveRecord::Migration
  def change
    remove_column :splunk_users, :authentication_id, :integer
  end
end
