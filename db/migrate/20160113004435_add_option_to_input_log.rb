class AddOptionToInputLog < ActiveRecord::Migration
  def change
    add_column :input_logs, :option, :string
  end
end
