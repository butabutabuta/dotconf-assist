class RemoveEmailFromAuthentications < ActiveRecord::Migration
  def change
    remove_column :authentications, :email, :string
  end
end
