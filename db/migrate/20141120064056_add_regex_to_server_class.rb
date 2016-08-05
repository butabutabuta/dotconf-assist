class AddRegexToServerClass < ActiveRecord::Migration
  def change
    add_column :server_classes, :regex, :string
  end
end
