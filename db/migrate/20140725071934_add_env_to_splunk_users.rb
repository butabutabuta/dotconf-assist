class AddEnvToSplunkUsers < ActiveRecord::Migration
  def change
    add_column :splunk_users, :env, :string
  end
end
