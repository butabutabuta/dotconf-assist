class CreateInputLogs < ActiveRecord::Migration
  def change
    create_table :input_logs do |t|
      t.integer :splunk_user_id
      t.string :source_hostname
      t.string :log_file_path
      t.string :sourcetype
      t.string :log_file_size
      t.string :data_retention_period
      t.text :memo

      t.timestamps
    end
  end
end
