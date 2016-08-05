class AddPublishStatusToAnnouncements < ActiveRecord::Migration
  def change
    add_column :announcements, :status, :integer
  end
end
