class CreateServerClassForwarders < ActiveRecord::Migration
  def change
    create_table :server_class_forwarders do |t|

      t.timestamps
    end
  end
end
