class AddStatusToInputLogs < ActiveRecord::Migration
  def change
    add_column :input_logs, :status, :integer
  end
end
