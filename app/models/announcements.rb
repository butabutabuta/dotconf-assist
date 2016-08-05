class Announcements < ActiveRecord::Base

  def get_announcements(request_by)
    begin
      Rails.logger.info "enters get_announcements"
      result="started"
      Rails.logger.info request_by
      if request_by=="admin"
        Rails.logger.info "request_by admin"
        announcement=Announcements.select(:id,:announce,:created_at,:status)
      elsif request_by == "users"
        Rails.logger.info "request_by users"
        status=1
        announcement=Announcements.select(:announce,:created_at).where(["status=?",status]).order(created_at: :desc)
      elsif request_by == "anonymous"
        Rails.logger.info "request_by anonymous user"
        status=1
        announcement=Announcements.select(:announce,:created_at).where(["status=?",status]).order(created_at: :desc)
      end
      result=announcement
    rescue
     result="failed"
      Rails.logger.info "rescues get_announcements"
    ensure
      Rails.logger.info "completes get_announcements"
    end
    return(result)
  end

  def add_announcement(announce,status)
    begin
      result="starts"
      Rails.logger.info "enters add_announcement function"
      new_announcement=Announcements.new
      new_announcement.announce=announce
      if status=="Publish"
        status=1
      else
        status=0
      end
      new_announcement.status=status
      new_announcement.save
      result="success"
    rescue
      result="failed"
      Rails.logger.info "rescues add_announcement function"
    ensure
      Rails.logger.info "completes add_announcement function"
    end
    return(result)
  end

  def update_announcement(announce,announcement,status)
    begin
      result="starts"
      Rails.logger.info "enters update_announcement function"
      new_announcement=Announcements.where(["id=?",announcement]).first
      new_announcement.announce=announce
      if status=="Publish"
        status=1
      else
        status=0
      end
      new_announcement.status=status
      new_announcement.save
      result="success"
    rescue
      result="failed"
      Rails.logger.info "rescues update_announcement function"
    ensure
      Rails.logger.info "completes update_announcement function"
    end
    return(result)
  end

  def delete_announcement(announce,announcement)
    begin
      result="starts"
      Rails.logger.info "enters delete_announcement function"
      new_announcement=Announcements.where(["id=?",announcement]).first
      new_announcement.delete
      result="success"
    rescue
      result="failed"
      Rails.logger.info "rescues delete_announcement function"
    ensure
      Rails.logger.info "completes delete_announcement function"
    end
    return(result)
  end

  def get_announcements_count(request_by)
    begin
      Rails.logger.info "enters get_announcements_count"
      result="started"
      announcement=Announcements.where(["status=?",1]).count
      result=announcement
    rescue
     result="failed"
      Rails.logger.info "rescues get_announcements_count"
    ensure
      Rails.logger.info "completes get_announcements_count"
    end
    return(result)
  end

end
