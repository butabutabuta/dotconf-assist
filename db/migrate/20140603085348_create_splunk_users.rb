class CreateSplunkUsers < ActiveRecord::Migration
  def change
    create_table :splunk_users do |t|
      t.string :user_name
      t.string :group_name
      t.string :app_team_name
      t.integer :serviceid
      t.boolean :rpaas_user_flg
      t.text :memo

      t.timestamps
    end
  end
end
