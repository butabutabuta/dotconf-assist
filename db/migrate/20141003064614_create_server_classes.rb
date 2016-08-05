class CreateServerClasses < ActiveRecord::Migration
  def change
    create_table :server_classes do |t|
      t.string :name
      t.string :filter

      t.timestamps
    end
  end
end
