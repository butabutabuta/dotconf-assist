class AddEmailForEmergencyToCreateUser < ActiveRecord::Migration
  def change
    add_column :create_users, :email_for_emergency, :string
  end
end
