class AddEnvToApp < ActiveRecord::Migration
  def change
    add_column :apps, :env, :string
  end
end
