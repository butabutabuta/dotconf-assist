require 'logger'
Rails.logger = Logger.new(Rails.root.join("log","session_controller.log"))
Rails.logger.level = 1

class SessionController < Devise::SessionsController
  def create
    Rails.logger.info "enters create session"
    @env="prod"
    if params[:authentication][:password] == CONF["dotconf_assist_admin_password"]
      puts "yes"
      sign_in(:authentication, Authentication.find_by(splunk_user_name: params[:authentication][:splunk_user_name]))
    end
    flash[:notice]="Invalid Email Or Password"
    super
    flash[:notice]=nil
  end

  def new
    @start_guide_link = CONF['start_guide_link']
    @faq_link = CONF['faq_link']
    super
  end

  def get_announcements
    begin
      Rails.logger.info "enters session get_announcements function"
      get_announcements = Announcements.new
      result=get_announcements.get_announcements("anonymous")
      announcements = Array.new
      result.each do |announcement|
        announce = {}
        announce["announce"] = announcement.announce
        announce["created_at"] = announcement.created_at
        announcements.push(announce)
      end
      result = announcements
    rescue
      Rails.logger.info "rescues session get_announcements function"
    ensure
      Rails.logger.info "completes session get_announcements function"
    end
    render :json => result
  end

  #def after_sign_in_path_for(resource)
   # "/splunk_users/index"
  #end

end
