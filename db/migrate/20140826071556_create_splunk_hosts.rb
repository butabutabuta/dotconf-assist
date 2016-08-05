class CreateSplunkHosts < ActiveRecord::Migration
  def change
    create_table :splunk_hosts do |t|
      t.string :name
      t.string :role

      t.timestamps
    end
  end
end
