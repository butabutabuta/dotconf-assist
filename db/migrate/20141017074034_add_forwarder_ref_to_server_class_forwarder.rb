class AddForwarderRefToServerClassForwarder < ActiveRecord::Migration
  def change
    add_reference :server_class_forwarders, :forwarder, index: true
  end
end
