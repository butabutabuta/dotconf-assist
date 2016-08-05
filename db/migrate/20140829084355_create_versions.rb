class CreateVersions < ActiveRecord::Migration
  def change
    create_table :versions do |t|
      t.integer :version

      t.timestamps
    end
  end
end
