class AddScriptNameToInputLog < ActiveRecord::Migration
  def change
    add_column :input_logs, :script_name, :string
  end
end
