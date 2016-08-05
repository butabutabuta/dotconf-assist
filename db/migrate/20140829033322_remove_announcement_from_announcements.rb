class RemoveAnnouncementFromAnnouncements < ActiveRecord::Migration
  def change
    remove_column :announcements, :announcement, :string
  end
end
