class AddStatusToCreateUser < ActiveRecord::Migration
  def change
    add_column :create_users, :status, :integer
  end
end
