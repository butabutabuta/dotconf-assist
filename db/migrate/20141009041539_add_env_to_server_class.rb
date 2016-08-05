class AddEnvToServerClass < ActiveRecord::Migration
  def change
    add_column :server_classes, :env, :string
  end
end
