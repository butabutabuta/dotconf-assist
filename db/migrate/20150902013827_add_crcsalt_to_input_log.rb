class AddCrcsaltToInputLog < ActiveRecord::Migration
  def change
    add_column :input_logs, :crcsalt, :string
  end
end
