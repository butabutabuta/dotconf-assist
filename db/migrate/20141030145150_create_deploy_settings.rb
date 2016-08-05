class CreateDeploySettings < ActiveRecord::Migration
  def change
    create_table :deploy_settings do |t|

      t.timestamps
    end
  end
end
