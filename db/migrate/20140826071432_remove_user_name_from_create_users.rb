class RemoveUserNameFromCreateUsers < ActiveRecord::Migration
  def change
    remove_column :create_users, :user_name, :string
  end
end
