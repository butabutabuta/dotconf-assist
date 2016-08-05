class AddDeployStatusToApp < ActiveRecord::Migration
  def change
    add_column :apps, :deploy_status, :integer
  end
end
