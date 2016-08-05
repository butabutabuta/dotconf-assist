class AddAuthenticationRefToSplunkUser < ActiveRecord::Migration
  def change
    add_reference :splunk_users, :authentication, index: true
  end
end
