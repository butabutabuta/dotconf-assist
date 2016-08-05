class AddCreateUserRefToServerClass < ActiveRecord::Migration
  def change
    add_reference :server_classes, :create_user, index: true
  end
end
