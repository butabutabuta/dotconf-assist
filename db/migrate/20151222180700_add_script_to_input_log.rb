class AddScriptToInputLog < ActiveRecord::Migration
  def change
    add_column :input_logs, :script, :binary
  end
end
