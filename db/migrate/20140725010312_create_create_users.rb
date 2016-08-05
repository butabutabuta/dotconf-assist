class CreateCreateUsers < ActiveRecord::Migration
  def change
    create_table :create_users do |t|
      t.string :email
      t.string :splunk_user_name
      t.string :password
      t.string :salt

      t.timestamps
    end
  end
end
