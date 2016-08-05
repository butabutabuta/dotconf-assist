class AddTypeToApp < ActiveRecord::Migration
  def change
    add_column :apps, :unixapp, :boolean
  end
end
