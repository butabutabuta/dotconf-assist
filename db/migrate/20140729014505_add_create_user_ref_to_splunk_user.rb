class AddCreateUserRefToSplunkUser < ActiveRecord::Migration
  def change
    add_reference :splunk_users, :create_user, index: true
  end
end
