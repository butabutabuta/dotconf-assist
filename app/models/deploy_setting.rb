require 'open-uri'
require 'net/http'
class DeploySetting < ActiveRecord::Base
  def add_record(app_id, server_class)
    begin
      Rails.logger.info "enters add_record function"
      result = "starts"
       add_record = DeploySetting.new
       add_record.app_id = app_id
       add_record.server_class_id = server_class
       add_record.save
      result = "success"
    rescue
      result = "fails"
      Rails.logger.info "rescues add_record function"
    ensure
      Rails.logger.info "completes add_record function"
    end
    return(result)
  end

  def deploy_setting(app_id , server_classes)
    begin
      Rails.logger.info "enters deploy_setting function"
      result = "starts"
      update_record = DeploySetting.new
      get_app_details = App.new
      result = update_record.delete_deploy_setting(app_id)
      if result == "success"
         result = update_record.add_deploy_setting(app_id, server_classes)
         if result == "success"
           app_status = get_app_details.get_record_for("deploy_status", "id", app_id)
           app_name =   get_app_details.get_record_for("name", "id", app_id)
           if app_status.deploy_status == 2 or app_status.deploy_status == 1 or app_status.deploy_status == 3
             result = app_name.name+ " Deploy Config Updated. Please SEND Request AGAIN so that NEW Changes will be updated on Splunk Cluster!!"
           else
             result = app_name.name+" Deploy Config Updated Successfully !!"
           end
         else
           result = "Something Went Wrong, Please Try Again or Contact our Admins. !!"
         end
      else
      end
    rescue
      result = "fails"
      Rails.logger.info "rescues deploy_setting function"
    ensure
      Rails.logger.info "completes deploy_setting function"
    end
    return(result)
  end

  def delete_deploy_setting(app_id)
    begin
      Rails.logger.info "enters delete_deploy_setting function"
      result = "starts"
      get_delete_record = DeploySetting.new
      delete_record = DeploySetting.where(["app_id = ?",app_id]).select("id")
      delete_record.each do |deploy_setting|
        get_delete_record.delete_record(deploy_setting.id)
      end
      result = "success"
    rescue
      result = "fails"
      Rails.logger.info "rescues delete_deploy_setting function"
    ensure
      Rails.logger.info "completes delete_deploy_setting function"
    end
    return(result)
  end


  def add_deploy_setting(app_id , server_classes)
    begin
      Rails.logger.info "enters add_deploy_setting function"
      result = "starts"
      all_server_classes = server_classes.split("|")
      add_record = DeploySetting.new
      all_server_classes.each do |server_class|
        add_record.add_record(app_id, server_class)
      end
      result = "success"
    rescue
      result = "fails"
      Rails.logger.info "rescues add_deploy_setting function"
    ensure
      Rails.logger.info "completes add_deploy_setting function"
    end
    return(result)
  end


  def delete_record(id)
    begin
      Rails.logger.info "enters delete_record function"
      result = "starts"
      delete_record = DeploySetting.where(["id = ?",id]).first
      delete_record.delete
      result = "success"
    rescue
      result = "fails"
      Rails.logger.info "rescues delete_record function"
    ensure
      Rails.logger.info "completes delete_record function"
    end
    return(result)
  end

  def get_deploy_setting(user, app_id, env)
    begin
      Rails.logger.info "enters get_deploy_setting function"
      result = "starts"
      deploy_settings = DeploySetting.where(["app_id = ?", app_id]).select("server_class_id")
      get_server_class = ServerClass.new
      get_server_classes = ServerClass.new
      app_server_classes = Array.new
      classes = Array.new
      deploy_settings.each do |server_class|
        app_server_class = get_server_class.get_record_of_user_for(user,"id",server_class.server_class_id)
        app_server_classes.push(app_server_class)
      end
      server_classes = get_server_classes.get_all_records_of_user_for(user, "env", env)
      server_classes.each do |server_class|
         if !(app_server_classes.include?(server_class))
           classes.push(server_class)
         end
      end
      app_server_classes = app_server_classes.concat(["ends"])
      app_server_classes = app_server_classes.concat(classes)
      result = app_server_classes
    rescue
      result = "fails"
      Rails.logger.info "rescues get_deploy_setting function"
    ensure
      Rails.logger.info "completes get_deploy_setting function"
    end
    return(result)
  end

  def request_app_deploy_settings(user, app_id, env, user_name)
    begin
      Rails.logger.info "enters request_app_deploy_settings function"
      result = "starts"
      get_app_deploy_settings = DeploySetting.new
      change_deploy_status = App.new
      get_user_email = CreateUser.new
      get_server_class_details = ServerClass.new
      white_list_regex = Array.new
      server_classes = get_app_deploy_settings.get_all_records_for("server_class_id","app_id",app_id)
      server_classes.each do |server_class|
        regex = get_server_class_details.get_record_for("regex", "id", server_class.server_class_id)
        #white_list_regex.push(regex.regex)
        white_list_regex.push("")
      end
      email_content = get_app_deploy_settings.app_deploy_settings(user, app_id, env, user_name)
      user_email_content = get_app_deploy_settings.app_deploy_settings(user, app_id, env, user_name)
      SupportMail.deploy_setting_inform_admin_email(email_content, user_name, env, app_id, white_list_regex).deliver
      user_email = get_user_email.get_record_for("email","id",user) 
      if user_email.email != nil
        SupportMail.deploy_setting_email(user_email.email, user_name, user_email_content, app_id, env, white_list_regex).deliver
      end
      result = change_deploy_status.change_deploy_status(app_id, "2")
      if result == "success"
        result = "Request Sent To Admin !!"
      else
        result = "Please Try Again Later or Contact Our Admins !!"
      end
    rescue
      result = "fails"
      Rails.logger.info "rescues request_app_deploy_settings function"
    ensure
      Rails.logger.info "completes request_app_deploy_settings function"
    end
    return(result)
  end

  def app_deploy_settings(user, app_id, env, user_name)
    begin
      Rails.logger.info "enters app_deploy_settings function"
      result = "starts"
      email_content = Array.new
      get_server_classes = DeploySetting.new
      get_forwarder_relation = ServerClassForwarder.new
      get_forwarder_details = Forwarder.new
      get_app_details = App.new
      get_input_log_details = InputLog.new
      change_deploy_status = App.new
      if user == ""
        get_user_details = CreateUser.new
        get_app_details = App.new
        user = get_app_details.get_record_for("create_user_id","id",app_id)
        user_name = get_user_details.get_record_for("splunk_user_name","id",user.create_user_id)
        env = get_app_details = get_app_details.get_record_for("env","id",app_id)
        user = user.create_user_id
        env = env.env
        user_name = user_name.splunk_user_name
      end
      server_classes = get_server_classes.get_deploy_setting(user, app_id, env)
      server_classes.slice!(server_classes.index("ends"), server_classes.length())
      server_classes.each do |server_class|
        email_content.push(server_class.name)
        forwarder_relation = get_forwarder_relation.get_all_records_for("forwarder_id","server_class_id",server_class.id)
        forwarder_relation.each do |forwarder|
          forwarder_details = get_forwarder_details.get_record_for("name","id",forwarder.forwarder_id)
          email_content.push(forwarder_details.name)
        end
        email_content.push("Server Class ends")
      end
      email_content.push("forwarders_end")
      app_name = get_app_details.get_record_for("name","id",app_id)
      email_content.push(app_name.name)
      input_logs = get_input_log_details.get_records_for_app(user, app_id, env)
      input_logs.each do |input_log|
        email_content.push(input_log.id)
      end
      result = email_content
    rescue
      result = "fails"
      Rails.logger.info "rescues app_deploy_settings function"
    ensure
      Rails.logger.info "completes app_deploy_settings function"
    end
    return (result)
  end

  def approve_app_deploy_settings(app_id, message_user)
    begin
      Rails.logger.info "enters approve_app_deploy_settings function"
      result = "starts"
      change_deploy_status = App.new
      get_app_details = App.new
      approve_inputs = InputLog.new
      app_name = get_app_details.get_record_for("name","id",app_id)
      result = change_deploy_status.change_deploy_status(app_id, "1")
      app_inputs = InputLog.where(["app_id = ?", app_id]).select(:id)
      app_inputs.each do |app_input|
        approve_inputs.approve_input(app_input.id)
      end
      if result == "success"
        result = "Application Settings Approved Successfully. Check Email for Acknowledgement."
        get_user_details = CreateUser.new
        user_id = get_app_details.get_record_for("create_user_id","id",app_id)
        user_name = get_user_details.get_record_for("splunk_user_name","id",user_id.create_user_id)
        user_email = get_user_details.get_record_for("email","id",user_id.create_user_id)
        SupportMail.approve_deploy_setting_inform_admin_email(app_name.name, message_user).deliver    
        if user_email.email!=nil
          SupportMail.approve_deploy_setting_inform_email(user_email.email, user_name.splunk_user_name, app_name.name, message_user).deliver
        end
      end
    rescue
      result = "fails"
      Rails.logger.info "rescues approve_app_deploy_settings function"
    ensure
      Rails.logger.info "completes approve_app_deploy_settings function"
    end
    return(result)
  end


  def cancel_app_deploy_settings(app_id, message_user)
    begin
      Rails.logger.info "enters cancel_app_deploy_settings function"
      result = "starts"
      change_deploy_status = App.new
      get_app_details = App.new
      app_name = get_app_details.get_record_for("name","id",app_id)
      result = change_deploy_status.change_deploy_status(app_id, "9")
      if result == "success"
        result = "Application Settings Cancelled Successfully. Check Email for Acknowledgement."
        get_user_details = CreateUser.new
        user_id = get_app_details.get_record_for("create_user_id","id",app_id)
        user_name = get_user_details.get_record_for("splunk_user_name","id",user_id.create_user_id)
        user_email = get_user_details.get_record_for("email","id",user_id.create_user_id)
        SupportMail.cancel_deploy_setting_inform_admin_email(app_name.name, message_user).deliver    
        if user_email.email!=nil
          SupportMail.cancel_deploy_setting_inform_email(user_email.email, user_name.splunk_user_name, app_name.name, message_user).deliver
        end
      end
    rescue
      result = "fails"
      Rails.logger.info "rescues cancel_app_deploy_settings function"
    ensure
      Rails.logger.info "completes cancel_app_deploy_settings function"
    end
    return(result)
  end

  def get_all_records_for(attribute,where_attribute,where_value)
    begin
      result="starts"
      Rails.logger.info "enters get_all_records_for #{attribute} function"
      get_all_records_for = DeploySetting.where(["#{where_attribute} = ?",where_value]).select(attribute)
      result= get_all_records_for
    rescue
      result="fails"
      Rails.logger.info "rescues get_all_records_for #{attribute} function"
    ensure
      Rails.logger.info "completes get_all_records_for #{attribute} function"
    end
    return(result)
  end

  def delete_records_for(attribute, attribute_value)
    begin
      Rails.logger.info "enters delete_records_for #{attribute} function"
      result = "starts"
      delete_records = DeploySetting.where(["#{attribute} = ?", attribute_value])
      delete_records.each do |record|
        record.delete
      end
      result = "success"
    rescue
      result = "fails"
      Rails.logger.info "rescues delete_records_for #{attribute} function"
    ensure
      Rails.logger.info "completes delete_records_for #{attribute} function"
    end
  end

  def validate_request_app_deploy_settings ( app_id )
    begin
      Rails.logger.info "enters validate_request_app_deploy_settings function"
      result = "starts"
      get_count = DeploySetting.select(:id).where(["app_id = ?", app_id]).count
      result = get_count
    rescue
      result = "fails"
      Rails.logger.info "rescues validate_request_app_deploy_settings function"
    ensure
      Rails.logger.info "completes validate_request_app_deploy_settings function"
    end
    return(result)
  end

  def request_stop_forwarding ( user_name, app_id, user_id )
    begin
      Rails.logger.info "enters request_stop_forwarding function"
      result = "starts"
      get_app_details = App.new
      get_host_details = SplunkHosts.new
      get_app_inputs = InputLog.new
      app_inputs = get_app_inputs.get_inputs_for_app(app_id)
      app_inputs.each do |appinput|
        get_app_inputs.change_status(appinput.id, 0)
      end
      app_name = get_app_details.get_record_for("name", "id", app_id)
      host_id = get_app_details.get_record_for("splunk_hosts_id","id",app_id)
      host_name = get_host_details.get_record_for("name", "id", host_id.splunk_hosts_id)
      uri = URI.parse("http://"+host_name.name+":80/services/deployment/server/applications/dsapp_"+user_name+"_"+app_name.name)
      http = Net::HTTP::Proxy(CONF["proxy_host"], CONF["proxy_port"])
      http = http.new(uri.host, uri.port)
      request = Net::HTTP::Post.new(uri.request_uri)
      request.basic_auth CONF["splunk_admin_user_name"], CONF["splunk_admin_password"]
      request.set_form_data({"deinstall" => "true"})
      response = http.request(request)
      get_app_details.change_deploy_status(app_id, "3")
      result = "success"
    rescue
      result = "fails"
      Rails.logger.info "rescues request_stop_forwarding function"
    ensure
      Rails.logger.info "completes request_stop_forwarding function"
    end
    return(result)
  end

end
