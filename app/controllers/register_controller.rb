class RegisterController < Devise::RegistrationsController
  def new
    @appteam_link = CONF['appteam_link']
    @serviceid_link = CONF['serviceid_link']
  end

  def update
  end

  def create
  end

  def delete
  end

  def after_update_path_for(resource)
    "/"
  end

  def forgotPassword
  end

  def resetPassword
    begin
      Rails.logger.info "enters reset Password function"
      flash[:notice]="called"
      useuser=Authentication.new
      result=useuser.reset_password(params[:splunk_user_name],params[:email])
      if result=="failed"
        action="forgotPassword"
        controller="register"
        flash[:notice]="Server is under maintenance, Please Try Again Later!!"
      elsif result=="no email"
        flash[:notice]="You have not provided any Email Address, Please Contact our Admin for further steps."
      elsif result=="no_user"
        flash[:notice]="User Name Does not exist, Please check your User Name Again."
      elsif result=="Invalid Email"
        flash[:notice]="Email Address provided does NOT matches the Email Address in Database. Please Try Again."
      else
        action="index"
        controller="splunk_users"
        flash[:notice]="Please Check Your Email For Password."
      end
    rescue
      Rails.logger.info "rescues reset Password function"
    ensure
      Rails.logger.info "completes reset Password function"
    end
    redirect_to "/"
  end


end
