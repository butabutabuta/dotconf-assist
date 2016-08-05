class AddBlacklistToInputLog < ActiveRecord::Migration
  def change
    add_column :input_logs, :blacklist, :string
  end
end
