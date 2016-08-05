require 'logger'
Rails.logger = Logger.new(Rails.root.join("log","support_mail_mailer.log"))
Rails.logger.level = 1

class SupportMail < ActionMailer::Base
  default from: CONF["dotconf_assist_admin_email_address"]

  def newaccount_email(user)
    begin
      Rails.logger.info "enters newaccount_email function[support_mail.rb]"
      @user_name=user.splunk_user_name
      @app_team_name=user.app_team_name
      @group_name=user.group_name
      @serviceid=user.serviceid
      @user_email_for_emergency = user.email_for_emergency
      @user_email = user.email
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: user.email, subject: '[SPaaS] Request dotconf-assist Account')
    rescue => e
      Rails.logger.info e.message
      Rails.logger.info "rescues newaccount_email function [support_mail.rb]"
    ensure
      Rails.logger.info "completes newaccount_email function[support_mail.rb]"
    end
  end

  def newaccountinformadmin_email(user)
    Rails.logger.info "enters newaccountinformadmin_email function[support_mail.rb]"
    begin
      @user=user
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: CONF["dotconf_assist_inform_email_address"], subject: '[SPaaS] Request dotconf-assist Account')
    rescue
      Rails.logger.info "rescues newaccountinformadmin_email function[support_mail.rb]"
    ensure
      Rails.logger.info "completes newaccountinformadmin_email function[support_mail.rb]"
    end
  end


  def newrequest_email(email,user_name,app_team_name,group_name,serviceid,env)
    begin
      Rails.logger.info "enters newrequest_email function[support_mail.rb]"
      @user_name=user_name
      @app_team_name=app_team_name
      @group_name=group_name
      @serviceid=serviceid
      @env=env
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: email, subject: '[Request]Splunk as a Service Account')
    rescue
      Rails.logger.info "rescues newrequest_email function[support_mail.rb]"
    ensure
      Rails.logger.info "completes newrequest_email function[support_mail.rb]"
    end
  end

  def newrequestinformadmin_email(user,env)
    Rails.logger.info "enters newrequestinformadmin_email function[support_mail.rb]"
    begin
      @user=user
      @env=env
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      Rails.logger.info "calling mail function[support_mail.rb]"
      mail(to: CONF["dotconf_assist_inform_email_address"], subject: '[Request]Splunk as a Service Account')
      Rails.logger.info "mail sent"
    rescue
      Rails.logger.info "rescues newrequestinformadmin_email function[support_mail.rb]"
    ensure
      Rails.logger.info "completes newrequestinformadmin_email function[support_mail.rb]"
    end
  end

  def requestapprove_email(user,email,env, splunk_host, rpaas_user_name, memo)
    @user=user
    @env=env
    @splunk_host = splunk_host
    @rpaas_user_name = rpaas_user_name
    @memo = memo 
    @dotconf_assist_domain = CONF["dotconf_assist_domain"]
    if @memo == ""
      @memo = "Not Provided"
    end
    if @rpaas_user_name == ""
      @rpaas_user_name = "Not Provided"
    end
    mail(to: email, subject: '[Request]Splunk as a Service Account')
  end

  def requestcancelinformadmin_email(user)
    Rails.logger.info "enters requestcancelinformadmin_email function[support_mail.rb]"
    begin
      @user=user
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      Rails.logger.info "calling mail function[support_mail.rb]"
      mail(to: CONF["dotconf_assist_inform_email_address"], subject: '[Request]Splunk as a Service Account Rejected')
      Rails.logger.info "mail sent"
    rescue
      Rails.logger.info "rescues requestcancelinformadmin_email function[support_mail.rb]"
    ensure
      Rails.logger.info "completes requestcancelinformadmin_email function[support_mail.rb]"
    end
  end

  def requestapproveinformadmin_email(user,env, splunk_host, rpaas_user_name, memo, splunk_account_id)
    Rails.logger.info "enters requestapproveinformadmin_email function[support_mail.rb]"
    begin
      @user=user
      @env=env
      @splunk_host = splunk_host
      @rpaas_user_name = rpaas_user_name
      @memo = memo 
      if @memo == ""
        @memo = "Not Provided"
      end
      if @rpaas_user_name == ""
        @rpaas_user_name = "Not Provided"
      end
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      @splunk_account = splunk_account_id
      Rails.logger.info "calling mail function[support_mail.rb]"
      mail(to: CONF["dotconf_assist_inform_email_address"], subject: '[SPaaS] Created Splunk Web Account')
      Rails.logger.info "mail sent"
    rescue
      Rails.logger.info "rescues requestapproveinformadmin_email function[support_mail.rb]"
    ensure
      Rails.logger.info "completes requestapproveinformadmin_email function[support_mail.rb]"
    end
  end

  def requestcancel_email(user)
    @user=user
    @dotconf_assist_domain = CONF["dotconf_assist_domain"]
    Rails.logger.info "in email function"
    mail(to: user.email, subject: '[SPaaS] Canceled dotconf-assist Account')
  end

  def sendfeedback_email(data)
    begin
      Rails.logger.info "enters sendfeedback_email function"
      @data=data
      @username=@data["username"]
      @content=@data["content"]
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: CONF["dotconf_assist_inform_email_address"], subject:'[SPaaS] Feedback: [ '+ @data["username"] + ' ] '+@data["subject"])
    rescue
      Rails.logger.info "rescues in sendfeedback_email function"
    ensure
      Rails.logger.info "completes sendfeedback_email function"
    end
  end

  def resetpassword_email(username,useremail,password)
    begin
      Rails.logger.info "enters restepassowrd_email function"
      @password=password
      @user_name=username
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to:useremail , subject:'[SPaaS] Reset dotconf-assist Password')
    rescue
      Rails.logger.info "rescues in resetpassword_email function"
    ensure
      Rails.logger.info "completes resetpassword_email function"
    end
  end

  def noemailerror_email(username)
    begin
      Rails.logger.info "enters restepassowrdnoemailerror_email function"
      @user_name=username
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: CONF["dotconf_assist_inform_email_address"] , subject:'[Support]Splunk as a Service Account')
    rescue
      Rails.logger.info "rescues in resetpasswordnoemailerror_email function"
    ensure
      Rails.logger.info "completes resetpasswordnoemailerror_email function"
    end
  end


  def forwardersuggestchange_email(user_name,env,email,new_name,old_name)
    begin
      Rails.logger.info "enters forwardersuggestchange_email function"
      @user_name=user_name
      @env=env
      @new_name=new_name
      @old_name=old_name
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: email , subject:'[Support]Splunk as a Service Account')
    rescue
      Rails.logger.info "rescues forwardersuggestchange_email function"
    ensure
      Rails.logger.info "completes forwardersuggestchange_email function"
    end
  end


  def inputssuggestchange_email(new_log_file_path,old_log_file_path,new_source_type,old_source_type,new_log_file_size,old_log_file_size,new_log_retention_period,old_log_retention_period,new_memo,old_memo,email,user_name)
    begin
      Rails.logger.info "enters inputssuggestchange_email function"
      @new_log_file_path=new_log_file_path
      @old_log_file_path=old_log_file_path
      if old_log_file_path == new_log_file_path
        @log_file_path=0
      else
        @log_file_path=1
      end
      @new_source_type=new_source_type
      @old_source_type=old_source_type
      if old_source_type == new_source_type
        @source_type=0
      else
        @source_type=1
      end
      @new_log_file_size=new_log_file_size
      @old_log_file_size=old_log_file_size
      if old_log_file_size == new_log_file_size
        @log_file_size=0
      else
        @log_file_size=1
      end
      @new_log_retention_period=new_log_retention_period
      @old_log_retention_period=old_log_retention_period
      if old_log_retention_period == new_log_retention_period
        @log_retention_period=0
      else
        @log_retention_period=1
      end
      @new_memo=new_memo
      @old_memo=old_memo
      if old_memo == new_memo
        @memo=0
      else
        @memo=1
      end
      @user_name=user_name
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: email , subject:'[Support]Splunk as a Service Account')
    rescue
      Rails.logger.info "rescues inputssuggestchange_email function"
    ensure
      Rails.logger.info "completes inputssuggestchange_email function"
    end
  end

  def deploy_setting_inform_admin_email(email_content, user_name, env, app_id, white_list_regex)
    begin
      Rails.logger.info "enters deploy_setting_inform_admin_email function"
      result = "starts"
      @server_forwarder_email = Array.new
      @app_name_email = ""
      @input_logs = Array.new
      @user_name_email = user_name
      @env_email = env
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      @app_id = app_id
      @white_list_regex = white_list_regex
      forwarders_index = email_content.index("forwarders_end")
      forwarders = email_content.slice!(0..forwarders_index)
      server_class_index = forwarders.index("Server Class ends")
      while server_class_index!=nil do
        server_class = forwarders.slice!(0..server_class_index)
        server_class_name = server_class.slice!(0)
        if server_class_name != "forwarders_end"
          @server_forwarder_email.push(server_class_name)
        end
        @server_forwarder_email.push("starts")
        server_class.each do |forwarder_name|
          if forwarder_name != "Server Class ends" and forwarder_name != "forwarders_end"
            @server_forwarder_email.push(forwarder_name)
          end
        end
        @server_forwarder_email.push("ends")
        server_class_index = forwarders.index("Server Class ends")
      end
      @app_name_email = email_content.slice!(0)
      email_content.each do |input_log|
        @input_logs.push(input_log)
      end
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: CONF["dotconf_assist_inform_email_address"] , subject:'[SPaaS] Request Deploy Setting')
      result = "Mail Sent To Admin !"
    rescue
      result = "fails"
      Rails.logger.info "ensures deploy_setting_inform_admin_email function"
    ensure
      Rails.logger.info "completes deploy_setting_inform_admin_email function"
    end
    return(result)
  end

  def approve_deploy_setting_inform_admin_email(app_name, message_user)
    begin
      Rails.logger.info "enters approve_deploy_setting_inform_admin_email function"
      result = "starts"
      @app = app_name
      if message_user == ""
        @reason = nil
      else
        @reason = message_user
      end
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: CONF["dotconf_assist_inform_email_address"] , subject:'[SPaaS] Completed Deploy Setting')
    rescue
      result = "fails"
      Rails.logger.info "rescues approve_deploy_setting_inform_admin_email function"
    ensure
      Rails.logger.info "completes approve_deploy_setting_inform_admin_email function"
    end
    return(result)
  end

  def approve_deploy_setting_inform_email(user_email, user_name, app_name, message_user)
    begin
      Rails.logger.info "enters approve_deploy_setting_inform_email function"
      result = "starts"
      @app = app_name
      @user = user_name
      if message_user == ""
        @reason = nil
      else
        @reason = message_user
      end
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: user_email , subject:'[SPaaS] Completed Deploy Setting')
    rescue
      result = "fails"
      Rails.logger.info "rescues approve_deploy_setting_inform_email function"
    ensure
      Rails.logger.info "completes approve_deploy_setting_inform_email function"
    end
    return(result)
  end

  def cancel_deploy_setting_inform_admin_email(app_name, message_user)
    begin
      Rails.logger.info "enters cancel_deploy_setting_inform_admin_email function"
      result = "starts"
      @app = app_name
      if message_user == ""
        @reason = nil
      else
        @reason = message_user
      end
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: CONF["dotconf_assist_inform_email_address"] , subject:'[Support]Splunk as a Service Account')
    rescue
      result = "fails"
      Rails.logger.info "rescues cancel_deploy_setting_inform_admin_email function"
    ensure
      Rails.logger.info "completes cancel_deploy_setting_inform_admin_email function"
    end
    return(result)
  end

  def cancel_deploy_setting_inform_email(user_email, user_name, app_name, message_user)
    begin
      Rails.logger.info "enters cancel_deploy_setting_inform_email function"
      result = "starts"
      @app = app_name
      @user = user_name
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      if message_user == ""
        @reason = nil
      else
        @reason = message_user
      end
      mail(to: user_email , subject:'[Support]Splunk as a Service Account')
    rescue
      result = "fails"
      Rails.logger.info "rescues cancel_deploy_setting_inform_email function"
    ensure
      Rails.logger.info "completes cancel_deploy_setting_inform_email function"
    end
    return(result)
  end

  def account_approve_email(user)
    begin
      Rails.logger.info "enters account_approve_email function"
      result = "starts"
      @user = user
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: user.email , subject:'[SPaaS] Created dotconf-assist Account')
    rescue
      result = "fails"
      Rails.logger.info "rescues account_approve_email function"
    ensure
      Rails.logger.info "completes account_approve_email function"
    end
  end

  def account_approve_inform_admin_email(user)
    begin
      Rails.logger.info "enters account_approve_inform_admin_email function"
      result = "starts"
      @user = user
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: CONF["dotconf_assist_inform_email_address"] , subject:'[SPaaS] Created dotconf-assist Account')
    rescue
      result = "fails"
      Rails.logger.info "rescues account_approve_inform_admin_email function"
    ensure
      Rails.logger.info "completes account_approve_inform_admin_email function"
    end
  end


  def account_cancel_email(user)
    begin
      Rails.logger.info "enters account_cancel_email function"
      result = "starts"
      @user = user
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: user.email , subject:'[SPaaS] Canceled dotconf-assist Account')
    rescue
      result = "fails"
      Rails.logger.info "rescues account_cancel_email function"
    ensure
      Rails.logger.info "completes account_cancel_email function"
    end
  end

  def account_cancel_inform_admin_email(user)
    begin
      Rails.logger.info "enters account_cancel_inform_admin_email function"
      result = "starts"
      @user = user
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: CONF["dotconf_assist_inform_email_address"] , subject:'[SPaaS] Canceled dotconf-assist Account')
    rescue
      result = "fails"
      Rails.logger.info "rescues account_cancel_inform_admin_email function"
    ensure
      Rails.logger.info "completes account_cancel_inform_admin_email function"
    end
  end

  def profile_update_email(user)
    begin
      Rails.logger.info "enters profile_update_email function"
      result = "starts"
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      @user = user
      mail(to: user.email , subject:'[SPaaS] Updated dotconf-assist Account Information')
    rescue
      result = "fails"
      Rails.logger.info "rescues profile_update_email function"
    ensure
      Rails.logger.info "completes profile_update_email function"
    end
  end

  def profile_update_inform_admin_email(user)
    begin
      Rails.logger.info "enters profile_update_inform_admin_email function"
      result = "starts"
      @user = user
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: CONF["dotconf_assist_inform_email_address"] , subject:'[SPaaS] Updated dotconf-assist Account Information')
    rescue
      result = "fails"
      Rails.logger.info "rescues profile_update_inform_admin_email function"
    ensure
      Rails.logger.info "completes profile_update_inform_admin_email function"
    end
  end

  def send_feedback_acknowledgement_email(user_name, email)
    begin
      Rails.logger.info "enters send_feedback_acknowledgement_email function"
      @uer_name = user_name
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      mail(to: email, subject:'[SPaaS] Thank you for your Feedback')
    rescue
      Rails.logger.info "rescues send_feedback_acknowledgement_email function"
    ensure
      Rails.logger.info "completes send_feedback_acknowledgement_email function"
    end
  end

  def deploy_setting_email(user_email, user_name, email_content, app_id, env, white_list_regex)
    begin
      Rails.logger.info "enters deploy_setting_email function"
      result = "starts"
      @server_forwarder_email = Array.new
      @app_name_email = ""
      @input_logs = Array.new
      @user_name_email = user_name
      @env_email = env
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      @app_id = app_id
      @white_list_regex = white_list_regex
      forwarders_index = email_content.index("forwarders_end")
      forwarders = email_content.slice!(0..forwarders_index)
      server_class_index = forwarders.index("Server Class ends")
      while server_class_index!=nil do
        server_class = forwarders.slice!(0..server_class_index)
        server_class_name = server_class.slice!(0)
        if server_class_name != "forwarders_end"
          @server_forwarder_email.push(server_class_name)
        end
        @server_forwarder_email.push("starts")
        server_class.each do |forwarder_name|
          if forwarder_name != "Server Class ends" and forwarder_name != "forwarders_end"
            @server_forwarder_email.push(forwarder_name)
          end
        end
        @server_forwarder_email.push("ends")
        server_class_index = forwarders.index("Server Class ends")
      end
      @app_name_email = email_content.slice!(0)
      email_content.each do |input_log|
        @input_logs.push(input_log)
      end
      @user_name = user_name
      mail(to: user_email, subject:'[SPaaS] Request Deploy Setting')
    rescue
      result = "fails"
      Rails.logger.info "rescues deploy_setting_email function"
    ensure
      Rails.logger.info "completes deploy_setting_email function"
    end
  end

  def deploy_setting_re_apply_request ( new_parameter, user_email, user_name, env )
    begin
      Rails.logger.info "ensures deploy_setting_re_apply_request function"
      result = "starts"
      @user_name = user_name
      if new_parameter == "forwarder"
        @message = "You have Updated Forwarder in Server Class"
      elsif new_parameter == "delete server class"
        @message = "You have Deleted the Server Class"
      elsif new_parameter == "app"
        @message = "You have Updated the App Details"
      elsif new_parameter == "update deploy setting"
        @message = "You have Updated Server Classes for the App"
      end
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      @env = env
      mail(to: user_email, subject:'[SPaaS] Re-Request Deploy Setting')
    rescue
      result = "fails"
      Rails.logger.info "rescues deploy_setting_re_apply_request function"
    ensure
      Rails.logger.info "completes deploy_setting_re_apply_request function"
    end
  end

end
