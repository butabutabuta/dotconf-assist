class AddCreateUserRefToApp < ActiveRecord::Migration
  def change
    add_reference :apps, :create_user, index: true
  end
end
