class AddAccountDetailsToCreateUser < ActiveRecord::Migration
  def change
    add_column :create_users, :user_name, :string
    add_column :create_users, :group_name, :string
    add_column :create_users, :app_team_name, :string
    add_column :create_users, :serviceid, :integer
  end
end
