class RemoveSourceHostnameFromInputLog < ActiveRecord::Migration
  def change
    remove_column :input_logs, :source_hostname, :string
  end
end
