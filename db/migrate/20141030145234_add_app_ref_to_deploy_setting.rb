class AddAppRefToDeploySetting < ActiveRecord::Migration
  def change
    add_reference :deploy_settings, :app, index: true
  end
end
