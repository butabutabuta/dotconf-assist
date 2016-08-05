class AddCreateUserRefToForwarder < ActiveRecord::Migration
  def change
    add_reference :forwarders, :create_user, index: true
  end
end
