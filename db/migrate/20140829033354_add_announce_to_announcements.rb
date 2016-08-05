class AddAnnounceToAnnouncements < ActiveRecord::Migration
  def change
    add_column :announcements, :announce, :string
  end
end
