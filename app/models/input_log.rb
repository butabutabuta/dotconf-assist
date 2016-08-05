require 'splunk-sdk-ruby'
class InputLog < ActiveRecord::Base
belongs_to :splunk_users

  def check_if_exists(account_id)
    begin
        Rails.logger.info "enter InputLog check_if_exists function"
        input=InputLog.where(["splunk_users_id=?",account_id]).first
        if input==nil
          result="no"
        else
          result="yes"
        end
    rescue
        Rails.logger.info "rescues InputLog check_if_exists function"
    ensure
        Rails.logger.info "completes InputLog check_if_exists function"
    end
    return(result)
  end

  def save_input_log(log_file_path,sourcetype,log_file_size,data_retention_period,memo,
    create_user_id,env, blacklist_files, crcsalt, os, interval, script_name, script, option, type)
    begin
      Rails.logger.info "enters save_input_log function"
      result="starts"
      save_input_log = InputLog.new
      user_id = SplunkUser.where(["create_user_id = ? and env=?",create_user_id, env]).select("id").first
      save_input_log.splunk_users_id=user_id.id
      save_input_log.data_retention_period=data_retention_period
      save_input_log.memo=memo
      save_input_log.status=0
      if type == "log"#for log input
        save_input_log.log_file_size=log_file_size
        save_input_log.sourcetype=sourcetype
        save_input_log.log_file_path=log_file_path
        save_input_log.crcsalt=crcsalt
        save_input_log.blacklist = blacklist_files
      elsif type == "script" #for script
        save_input_log.log_file_size=log_file_size
        save_input_log.sourcetype=sourcetype
        save_input_log.os = os
        save_input_log.interval = interval
        save_input_log.script_name = script_name
        save_input_log.script = script.read
        save_input_log.option = option
      elsif type == "unixapp" #for unix app input
        save_input_log.interval = interval
        save_input_log.script_name = script_name
      end
      save_input_log.save
      result="success"
    rescue
      result="fails"
      Rails.logger.info "rescues save_input_log function"
    ensure
      Rails.logger.info "completes save_input_log function"
    end
    return(result)
  end

  def delete_record(id)
    begin
      Rails.logger.info "enters delete_record function"
      result="starts"
      delete_record=InputLog.where(["id=?",id]).first
      delete_record.delete
      result="success"
    rescue
      result="fails"
      Rails.logger.info "rescues delete_record function"
    ensure
      Rails.logger.info "completes delete_record function"
    end
    return(result)
  end

  def get_record(id)
    begin
      Rails.logger.info "enters get_record function"
      result="starts"
      record=InputLog.where(["id=?",id]).first
      result=record
    rescue
      result="fails"
      Rails.logger.info "rescues get_record function"
    ensure
      Rails.logger.info "completes get_record function"
    end
    return(result)
  end

  def edit_record(id,log_file_path,source_type,log_file_size,data_retention_period,memo,user_id,env,blacklist_files, crcsalt, os, interval, script_name, script, option, type)
    begin
      Rails.logger.info "enters edit_record function"
      result="starts"
      record=InputLog.where(["id=?",id]).first
      record.data_retention_period=data_retention_period
      record.memo=memo
      
      if type=="log"
        record.log_file_size=log_file_size
        record.sourcetype=source_type
        record.log_file_path=log_file_path
        record.crcsalt=crcsalt
        record.blacklist = blacklist_files
      elsif type=="script" #for script
        record.log_file_size=log_file_size
        record.sourcetype=source_type
        record.os = os
        record.interval = interval
        record.script_name = script_name
        record.option = option
        if script != nil #new file uploaded
          record.script = script.read
        end
      elsif type=="unixapp"#for unix app input
        record.interval = interval
      end

      record.save
      result="success"
    rescue
      result="fails"
      Rails.logger.info "rescues edit_record function"
    ensure
      Rails.logger.info "completes edit_record function"
    end
    return(result)
  end

  def get_records_count(where_attribute,where_value)
    begin
      result="starts"
      Rails.logger.info "enters get_records_count_for function #{where_attribute}"
      get_records_count = InputLog.where(["#{where_attribute} = ?", where_value]).count
      result= get_records_count
    rescue
      result="fails"
      Rails.logger.info "rescues get_records_count_for function #{where_attribute}"
    ensure
      Rails.logger.info "completes get_records_count_for function #{where_attribute}"
    end
    return(result)
  end

  def get_statistics
    begin
      result="starts"
      Rails.logger.info "enters get_statistics function"
      #get_user = CreateUser.new
      #users=get_users.get_all_records_for("id")
      get_splunk_users= SplunkUser.new
      splunk_users=get_splunk_users.get_all_records_for("id")
      get_splunk_user_name = CreateUser.new
      get_inputs_count = InputLog.new
      statistics = Array.new
      merge = Array.new
      splunk_users.each do |user|
        count_array =Array.new
        name_array= Array.new
        inputs_count=get_inputs_count.get_records_count("splunk_users_id",user.id)
        if inputs_count>0
          get_user=get_splunk_users.get_record_for("create_user_id","id",user.id)
          input_log_env=get_splunk_users.get_record_for("env","id",user.id)
          splunk_user_name=get_splunk_user_name.get_record_for("splunk_user_name","id",get_user.create_user_id)
          splunk_user_name=splunk_user_name.splunk_user_name + " - " + input_log_env.env
          count_array.push(inputs_count.to_s)
          name_array.push(splunk_user_name)
          count_array=count_array.zip(name_array)
          statistics.push(count_array)
        end
      end
      result=statistics
    rescue
      result="fails"
      Rails.logger.info "rescues get_statistics function"
    ensure
      Rails.logger.info "completes get_statistics function"
    end
    return(result)
  end

  def get_record_for(attribute,where_attribute,where_value)
    begin
      result="starts"
      Rails.logger.info "enters get_record_for #{attribute} function"
      get_record_for = InputLog.where(["#{where_attribute} = ?",where_value]).select(attribute).first
      result= get_record_for
    rescue
      result="fails"
      Rails.logger.info "rescues get_record_for #{attribute} function"
    ensure
      Rails.logger.info "completes get_record_for #{attribute} function"
    end
    return(result)
  end

  def suggest_changes(new_log_file_path,old_log_file_path,new_source_type,old_source_type,new_log_file_size,old_log_file_size,new_log_retention_period,old_log_retention_period,new_memo,old_memo,input_id)
    begin
      Rails.logger.info "enters suggest_changes function"
      get_user_id=SplunkUser.new
      get_splunk_user_id=InputLog.new
      get_email = CreateUser.new
      splunk_user_id=get_splunk_user_id.get_record_for("splunk_users_id","id",input_id)
      user_id=get_user_id.get_record_for("create_user_id","id",splunk_user_id.splunk_users_id)
      email=get_email.get_record_for("email","id",user_id.create_user_id)
      user_name=get_email.get_record_for("splunk_user_name","id",user_id.create_user_id)
      SupportMail.inputssuggestchange_email(new_log_file_path,old_log_file_path,new_source_type,old_source_type,new_log_file_size,old_log_file_size,new_log_retention_period,old_log_retention_period,new_memo,old_memo,email.email,user_name.splunk_user_name).deliver
    rescue
      Rails.logger.info "rescues suggest_changes function"
    ensure
      Rails.logger.info "completes suggest_changes function"
    end
  end

  def get_all_records_for_env(user, env)
    begin
      Rails.logger.info "enters get_all_records_for_env function"
      result = "starts"
      get_splunk_user = SplunkUser.new
      splunk_user = get_splunk_user.get_splunk_user_for_input_log("id","env",env,"create_user_id",user)
      all_records = InputLog.where(["splunk_users_id = ?", splunk_user.id])
      result = all_records
    rescue
      Rails.logger.info "rescues get_all_records_for_env function"
    ensure
      Rails.logger.info "completes get_all_records_for_env function"
    end
    return(result)
  end

  def add_app_ref(app_id,inputs_id)
    begin
      Rails.logger.info "enters add_app_ref function"
      result = "starts"
      Rails.logger.info "APP ID"
      Rails.logger.info app_id
      Rails.logger.info "INPUTS"
      Rails.logger.info inputs_id
      input_log = InputLog.where(["id = ?",inputs_id]).first
      Rails.logger.info input_log
      Rails.logger.info input_log.id
      input_log.app_id = app_id
      Rails.logger.info "WILL SAVE"
      input_log.save
      Rails.logger.info "SUCCESS"
      result = "success"
    rescue
      result = "fails"
      Rails.logger.info "rescues add_app_ref function"
    ensure
      Rails.logger.info "completes add_app_ref function"
    end
    return(result)
  end

  def get_all_records_for_apps(user, env)
    begin
      Rails.logger.info "enters get_all_records_for_app function"
      result = "starts"
      get_splunk_user = SplunkUser.new
      splunk_user = get_splunk_user.get_splunk_user_for_input_log("id","env",env,"create_user_id",user)
      null_app_id = 0
      all_records = InputLog.where(["splunk_users_id = ? and app_id is null", splunk_user.id]).order(:log_file_path)
      result = all_records
    rescue
      result="fails"
      Rails.logger.info "rescues get_all_records_for_app function"
    ensure
      Rails.logger.info "completes get_all_records_for_app function"
    end
    return(result)
  end

  def get_records_for_app(user, app_id, env)
    begin
      Rails.logger.info "enters get_records_for_app function"
      result = "starts"
      get_splunk_user = SplunkUser.new
      splunk_user = get_splunk_user.get_splunk_user_for_input_log("id","env",env,"create_user_id",user)
      records = InputLog.where(["splunk_users_id = ? and app_id = ?", splunk_user.id, app_id]).order(:log_file_path)
      result = records
    rescue
      result="fails"
      Rails.logger.info "rescues get_records_for_app function"
    ensure
      Rails.logger.info "completes get_records_for_app function"
    end
    return(result)
  end


  def delete_app_ref(app_id)
    begin
      Rails.logger.info "enters delete_app_ref function"
      result = "starts"
      input_logs = InputLog.where(["app_id = ?",app_id])
      input_logs.each do |log|
       log.app_id = nil
       if log.status == 1
         log.status = 0
       end
       log.save
      end
      result = "success"
    rescue
      result = "fails"
      Rails.logger.info "rescues delete_app_ref function"
    ensure
      Rails.logger.info "completes delete_app_ref function"
    end
    return(result)
  end

  def generateconf(input_id)
    begin
      Rails.logger.info "enters the generateconf function"
      @input=InputLog.where(["id = ?", input_id]).first
      Rails.logger.info "fetched input"
      result = ""
      disabled="disabled=false<br>"
      crcsalt = ""
      blacklist = ""
      sourcetype = ""
      ignore_older_than = "ignoreOlderThan=10d<br>"

      data_period=@input.data_retention_period
      if ((data_period[2,1])=='D')
         data_period=data_period[0,1]+"d"
      elsif ((data_period[2,1])=='W')
         data_period=data_period[0,1]+"w"
      elsif ((data_period[2,1])=='M')
         data_period=data_period[0,1]+"mon"
      elsif ((data_period[2,1])=='Y')
         data_period=data_period[0,1]+"y"
      end
      index = "index=idx_common_#{data_period}<br>"

      if @input.sourcetype != "auto"
          sourcetype = "sourcetype=#{@input.sourcetype}<br>"
      end

      if @input.log_file_path != nil #log file input
        log_file_path=transform_log_file_path(@input.log_file_path)
        log_file_path="<br>[monitor://#{log_file_path}]<br>"
        if @input.blacklist != "" && @input.blacklist != nil #nil is for old record NULL
            blacklist = transform_regex(@input.blacklist)
            blacklist = "blacklist=#{blacklist}<br>"
        end
        if @input.crcsalt == "<SOURCE>"
            crcsalt = "crcSalt=SOURCE<br>" 
        end
        result = "#{log_file_path}#{disabled}#{sourcetype}#{index}#{ignore_older_than}#{blacklist}#{crcsalt}"
      elsif @input.os != nil #script input
        script_file_path=""
        script_name = @input.script_name
        option = ""
        if @input.option != nil and @input.option != "" #nil is for old inputs
          option = " " + @input.option
        end
        script_file_path="<br>[script://./bin/#{script_name}#{option}]<br>"
        if @input.os == "windows"
          script_file_path="<br>[script://.\\bin\\#{script_name}#{option}]<br>"
          script_file_path=transform_log_file_path(script_file_path)
        end
        interval = "interval=#{@input.interval}<br>"
        result = "#{script_file_path}#{disabled}#{sourcetype}#{index}#{ignore_older_than}#{interval}" #for inputs.conf each attribute
      elsif @input.script_name != nil #unix app
        script_name = @input.script_name
        script_file_path="<br>[script://./bin/#{script_name}]<br>"
        interval = "interval=#{@input.interval}<br>"
        result = "#{script_file_path}#{disabled}#{index}#{interval}"
      end

    rescue
      result = "fails"
      Rails.logger.info "rescues the generateconf function"
    ensure
      Rails.logger.info "completes the generateconf function"
    end
    return(result)
  end

  def approve_input(input_id)
    begin
      Rails.logger.info "enters approve_input function"
      result = "starts"
      input = InputLog.where(["id = ?", input_id]).first
      input.status=1
      input.save
    rescue
      result = "fails"
      Rails.logger.info "rescues approve_input function"
    ensure
      Rails.logger.info "completes approve_input function"
    end
    return(result)
  end

  def change_status(input_id, status)
    begin
      Rails.logger.info "change_status function"
      result = "starts"
      input = InputLog.where(["id = ?", input_id]).first
      input.status = 0
      input.save
      result = "success"
    rescue
      result = "fails"
      Rails.logger.info "change_status function"
    ensure
      Rails.logger.info "change_status function"
    end
    return(result)
  end

  def get_inputs_for_app(app_id)
    begin
      Rails.logger.info "enters get_inputs_for_app function"
      result = "starts"
      inputs = InputLog.where(["app_id = ?", app_id]).select(:id)
      result = inputs
    rescue
      result = "fails"
      Rails.logger.info "rescues get_inputs_for_app function"
    ensure
      Rails.logger.info "completes get_inputs_for_app function"
    end
    return(result)
  end

  def has_associated_input_log ( app_id )
    begin
      Rails.logger.info "enters has associated app function"
      result = "starts"
      app_count = InputLog.select(:id).where(["app_id = ?", app_id]).count
      result = app_count
    rescue
      result = "fails"
      Rails.logger.info "rescues has associated app function"
    ensure
      Rails.logger.info "completes has associated app function"
    end
    return(result)
  end


  def has_associated_app ( input_log_id )
    begin
      Rails.logger.info "enters has associated app function"
      result = "starts"
      app = InputLog.select(:app_id).where(["id = ?", input_log_id]).first
      if app.app_id == nil
        result = 0
      else
        result = 1
      end
    rescue
      result = "fails"
      Rails.logger.info "rescues has associated app function"
    ensure
      Rails.logger.info "completes has associated app function"
    end
    return(result)
  end

  def transform_regex(value)
    begin
      Rails.logger.info "enters transform_regex function"
      #to deal with old version -> .gz$
      if value[0] == "."
        value = value.insert(value.length-1,")")
        value = value.insert(1, "(")
        value = value.insert(0, "\\")
      end

      result = value
    rescue
      Rails.logger.info "rescues transform_regex function"
    ensure
      Rails.logger.info "completes transform_regex function"
    end
    return(result)
  end

  def transform_log_file_path(value)
    begin
      Rails.logger.info "enters transform_log_file_path function"
      value = value.gsub(/(\\n)/, '\\\\\\n')
      value = value.gsub(/(\\r)/, '\\\\\\r')
      value = value.gsub(/(\\t)/, '\\\\\\t')
      value = value.gsub(/(\\a)/, '\\\\\\a')
      value = value.gsub(/(\\b)/, '\\\\\\b')
      value = value.gsub(/(\\c)/, '\\\\\\c')
      value = value.gsub(/(\\e)/, '\\\\\\e')
      value = value.gsub(/(\\f)/, '\\\\\\f')
      value = value.gsub(/(\\v)/, '\\\\\\v')
      result = value
    rescue
      Rails.logger.info "rescues transform_log_file_path function"
    ensure
      Rails.logger.info "completes transform_log_file_path function"
    end
    return(result)
  end

  def get_splunk_search_result(service, statement, earliest, latest)
    begin
      Rails.logger.info "enters get_splunk_search_result function"
      result = Array.new
      job = service.create_search(statement,:earliest_time => earliest,:latest_time => latest)
      until job.is_ready? && job.is_done?
          sleep(1)
      end
      stream = job.results(:count => 0, :offset => 0)
      records = Splunk::ResultsReader.new(stream)
      records.each do |record|
        result.push(record)
      end
    rescue => e
      puts e.message
      Rails.logger.info "rescues get_splunk_search_result function"
    ensure
      Rails.logger.info "completes get_splunk_search_result function"
    end
    return result
  end

  def get_log_size(env, month, host, service_id)
    begin
      Rails.logger.info "enters get_log_size function"
      ns = Splunk::namespace(:sharing => "app", :app => "admin")
      config = {
        :scheme => :http,
        :host => host,
        :port => 80,
        :username => CONF["splunk_admin_user_name"],
        :password => CONF["splunk_admin_password"],
        :namespace => ns
      }
      service = Splunk::connect(config)
      puts "Logged in service. Token: #{service.token}"
      result = get_splunk_search_result(service, "search index=summary search_name=sum_license_usage2 month=" + month + "* |table month service_id h tmp_mb tmp_total percentage totalsize virtual_mb | sort - virtual_mb | search service_id=" + service_id, "1460732400", "now") #1460732400 is 2016.05.16
    rescue => e
      puts e.message
      Rails.logger.info "rescues get_log_size function"
    ensure
      Rails.logger.info "completes get_log_size function"
    end
    return result
  end

  def get_log_storage(env, month, host, service_id)
    begin
      Rails.logger.info "enters get_log_storage function"
      ns = Splunk::namespace(:sharing => "app", :app => "admin")
      config = {
        :scheme => :http,
        :host => host,
        :port => 80,
        :username => CONF["splunk_admin_user_name"],
        :password => CONF["splunk_admin_password"],
        :namespace => ns
      }
      service = Splunk::connect(config)
      result = get_splunk_search_result(service, "search index=summary search_name=sum_diskusage* month=" + month + "* |table month service_id index_dirname allocation_rate virtual_mb | sort - virtual_mb | search service_id=" + service_id, "1467990000", "now") #1468594800 is 2016.07.09
    rescue => e
      puts e.message
      Rails.logger.info "rescues get_log_storage function"
    ensure
      Rails.logger.info "completes get_log_storage function"
    end
    return result
  end

  # def get_unit_prices()
  #   begin
  #     Rails.logger.info "enters get_unit_prices function"
      
  #   rescue => e
  #     puts e.message
  #     Rails.logger.info "rescues get_unit_prices function"
  #   ensure
  #     Rails.logger.info "completes get_unit_prices function"
  #   end
  #   return result
  # end

end
