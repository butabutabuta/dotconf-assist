class AddSplunkHostsRefToApp < ActiveRecord::Migration
  def change
    add_reference :apps, :splunk_hosts, index: true
  end
end
