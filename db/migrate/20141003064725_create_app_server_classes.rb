class CreateAppServerClasses < ActiveRecord::Migration
  def change
    create_table :app_server_classes do |t|

      t.timestamps
    end
  end
end
