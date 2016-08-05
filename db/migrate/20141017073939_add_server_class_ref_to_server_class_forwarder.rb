class AddServerClassRefToServerClassForwarder < ActiveRecord::Migration
  def change
    add_reference :server_class_forwarders, :server_class, index: true
  end
end
