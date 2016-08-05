class AddAppRefToInputLog < ActiveRecord::Migration
  def change
    add_reference :input_logs, :app, index: true
  end
end
