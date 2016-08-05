class AddEnvToSplunkHosts < ActiveRecord::Migration
  def change
    add_column :splunk_hosts, :env, :string
  end
end
