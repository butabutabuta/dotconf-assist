class AddOsToInputLog < ActiveRecord::Migration
  def change
    add_column :input_logs, :os, :string
  end
end
