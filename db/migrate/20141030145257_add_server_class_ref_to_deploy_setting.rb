class AddServerClassRefToDeploySetting < ActiveRecord::Migration
  def change
    add_reference :deploy_settings, :server_class, index: true
  end
end
