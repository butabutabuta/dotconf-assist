class AddCreateUserRefToAuthentication < ActiveRecord::Migration
  def change
    add_reference :authentications, :create_user, index: true
  end
end
