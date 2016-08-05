class CreatePrices < ActiveRecord::Migration
  def change
    create_table :prices do |t|
      t.integer :service_unit_price
      t.integer :storage_unit_price

      t.timestamps
    end
  end
end
