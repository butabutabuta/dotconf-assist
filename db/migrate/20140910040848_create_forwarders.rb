class CreateForwarders < ActiveRecord::Migration
  def change
    create_table :forwarders do |t|
      t.string :name
      t.string :env

      t.timestamps
    end
  end
end
