require 'net/ssh'
require 'net/scp'
require 'shellwords'
require 'splunk-sdk-ruby'

class App < ActiveRecord::Base
	def add_record(user,app_name,env,inputs,unixapp)
		begin
			Rails.logger.info "enters add_app function"
			result = "starts"
			add_record = App.new
			app_name.gsub! "\s", "-"
			add_record.name = app_name
			add_record.env = env
			add_record.create_user_id = user
			add_record.unixapp = unixapp
			add_record.save
			inputs_list = inputs.split("|")
			app_id = add_record.id
			Rails.logger.info "App ID"
			Rails.logger.info app_id
			Rails.logger.info "Inputs"
			Rails.logger.info inputs
			add_app_ref_to_input_log = InputLog.new
			inputs_list.each do |input|
			if input.chop == " "
				input = input.chop
			end
			if input[0] == " "
				input[0]=""
			end
				add_app_ref_to_input_log.add_app_ref(app_id, input)
			end
			result = "success"
		rescue
			result = "fails"
			Rails.logger.info "rescues add_app function"
		ensure
			Rails.logger.info "completes add_app function"
		end
		return(result)
	end

  def get_all_records_by_env(user,env)
	begin 
	  Rails.logger.info "enters get_all_records_by_env function"
	  result = "starts"
	  get_all_records = App.where(["create_user_id = ? and env = ?",user,env]).order(:name)
	  result = get_all_records
	rescue
	  result = "fails"
	  Rails.logger.info "rescues get_all_records_by_env function"
	ensure
	  Rails.logger.info "completes get_all_records_by_env function"
	end
	return(result)
  end


  def edit_record(user,app,app_name,env,inputs)
	begin
	  Rails.logger.info "enters edit_record function"
	  result = "starts"
	  edit_record = App.new
	  #result = edit_record.delete_record(app)
	  #result = edit_record.add_record(user,app_name,env,inputs)
	  delete_app_refs = InputLog.new
	  result = delete_app_refs.delete_app_ref(app)
	  inputs_list = inputs.split("|")
	  add_app_ref_to_input_log = InputLog.new
	  inputs_list.each do |input|
		if input.chop == " "
		  input = input.chop
		end
		if input[0] == " "
		  input[0]=""
		end
		add_app_ref_to_input_log.add_app_ref(app, input)
	  end
	  edit_record = App.where(["id = ?", app]).first
	  app_name.gsub! "\s", "-"
	  edit_record.name = app_name
	  edit_record.save
	  result = "success"
	rescue
	  result = "fails"
	  Rails.logger.info "rescues edit_record function"
	ensure
	  Rails.logger.info "completes edit_record function"
	end
	return(result)
  end

  def delete_record(app)
	begin
	  Rails.logger.info "enters delete_record function"
	  result = "starts"
	  delete_app_ref_to_inputs = InputLog.new
	  delete_deploy_setting = DeploySetting.new
	  result = delete_deploy_setting.delete_deploy_setting(app)
	  result = delete_app_ref_to_inputs.delete_app_ref(app)
	  delete_record = App.where(["id = ?", app]).first
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

  def request_app_deploy_settings(app)
	begin
	  Rails.logger.info "enters request_app_deploy_settings function"
	  result = "starts"
	  SupportMail.deploy_setting_inform_admin_email().deliver
	rescue
	  result = "fails"
	  Rails.logger.info "rescues request_app_deploy_settings function"
	ensure
	  Rails.logger.info "completes request_app_deploy_settings function"
	end
	return(result)
  end

  def get_record_for(attribute,where_attribute,where_value)
	begin
	  result="starts"
	  Rails.logger.info "enters get_record_for #{attribute} function"
	  get_record_for = App.where(["#{where_attribute} = ?",where_value]).select(attribute).first
	  result= get_record_for
	rescue
	  result="fails"
	  Rails.logger.info "rescues get_record_for #{attribute} function"
	ensure
	  Rails.logger.info "completes get_record_for #{attribute} function"
	end
	return(result)
  end

  def change_deploy_status(app_id, status)
	begin
	  Rails.logger.info "enters change_deploy_status function"
	  result = "starts"
	  change_deploy_status = App.where(["id = ?",app_id]).first
	  change_deploy_status.deploy_status = status
	  change_deploy_status.save
	  result = "success"
	rescue
	  result = "fails"
	  Rails.logger.info "rescues change_deploy_status function"
	ensure
	  Rails.logger.info "completes change_deploy_status function"
	end
	return(result)
  end

  def list_user_apps
	begin
	  Rails.logger.info "enters list_user_apps function"
	  result = "starts"
	  user_apps = []
	  get_user_name = CreateUser.new
	  list_user_apps = App.select(:id,:name,:env,:deploy_status, :create_user_id, :updated_at)
	  list_user_apps.each do | user_app |
		app_details = {}
		user_name = get_user_name.get_record_for("splunk_user_name","id",user_app.create_user_id)
		app_details[:new_env] = user_app.env
		user_app.env = user_name.splunk_user_name
		app_details[:name] = user_app.name
		app_details[:id] = user_app.id
		app_details[:env] = user_app.env
		app_details[:deploy_status] = user_app.deploy_status
		app_details[:created_at] = user_app.updated_at
		app_details[:create_user_id] = user_app.create_user_id
		user_apps.push(app_details)
	  end
	  result = user_apps
	rescue
	  result = "fails"
	  Rails.logger.info "rescues list_user_apps function"
	ensure
	  Rails.logger.info "completes list_user_apps function"
	end
	return(result)
  end


  def get_all_records_for(attribute,where_attribute,where_value)
	begin
	  result="starts"
	  Rails.logger.info "enters get_all_records_for #{attribute} function"
	  get_all_records_for = App.where(["#{where_attribute} = ?",where_value]).select(attribute)
	  result= get_all_records_for
	rescue
	  result="fails"
	  Rails.logger.info "rescues get_all_records_for #{attribute} function"
	ensure
	  Rails.logger.info "completes get_all_records_for #{attribute} function"
	end
	return(result)
  end

  def get_whitelist_for_app(app_id)
	begin
	  Rails.logger.info "enters get_whitelist_for_app function"
	  result = "starts"
	  get_server_classes = DeploySetting.new
	  get_server_class_detail = ServerClass.new
	  server_classes = get_server_classes.get_all_records_for("server_class_id","app_id",app_id)
	  server_classes.each do |server_class|
		whitelist
	  end
	rescue
	  result = "fails"
	  Rails.logger.info "rescues get_whitelist_for_app function"
	ensure
	  Rails.logger.info "completes get_whitelist_for_app function"
	end
	return(result)
  end

  def add_deploy_host_ref (app_id, host_id)
	begin
	  Rails.logger.info "enters add_deploy_host_ref function"
	  result = "starts"
	  add_ref = App.where(["id = ?",app_id]).first
	  add_ref.splunk_hosts_id = host_id
	  add_ref.save
	  result = "success"
	rescue
	  result = "fails"
	  Rails.logger.info "rescues add_deploy_host_ref function"
	ensure
	  Rails.logger.info "completes add_deploy_host_ref function"
	end
	return(result)
  end

  def create_deployment_app(deploy_host, ssh_user, ssh_password, app_data, input_ids, app_env)
	begin
	  Rails.logger.info "enters create_deployment_app function"
	  result = "starts"
	  is_unix_app = false
	  app_data_array = app_data.split("<br>")
	  app_name = app_data_array[1]  #mkdir -p /opt/splunk/etc/deployment-apps/dsapp_user_test_mix/local
	  input_name = app_data_array[2]
	  input_name = input_name[3..input_name.length] #delete "vi "
	  app_data_array.slice!(0..2)
	  input_data = ""

	  app_folder = app_name[9..app_name.length-7] #/opt/splunk/etc/deployment-apps/dsapp_user_test_mix
	  bin_folder = app_folder + "/bin"
	  make_bin_folder = "mkdir -p " + "#{bin_folder}"
	  remove_existing_unixapp = "rm -rf " + app_folder
	  copy_unixapp_template = "cp -rp /opt/splunk/etc/deployment-apps/Splunk_TA_nix_basic " + app_folder

	  script_names=Array.new
	  script_data=Array.new
	  id_arr = input_ids.split(",")
	  id_arr.each do |id|
		input=InputLog.where(["id=?", id]).first
		if input.os != nil #script
		  script_data.push(input.script)
		  script_names.push(input.script_name)
		elsif input.script_name != nil #unix app
		  is_unix_app = true
		end
	  end

	  pwd_correct = false
	  permisson_correct = true
	  
	  app_data_array.each do |input_conf_content|
		if input_conf_content == "crcSalt=<source>" #for crcsalt = "crcSalt=\<SOURCE\><br>" in input_log.rb
			input_conf_content = "crcSalt=<SOURCE>"
		end
		if input_conf_content == "crcSalt=SOURCE"  #for crcsalt = "crcSalt=SOURCE<br>" in input_log.rb
			input_conf_content = "crcSalt=<SOURCE>"
		end
		input_data = input_data + input_conf_content +"\\n"
	  end
	  
	  result = "success"
	  Net::SSH.start("#{deploy_host}", "#{ssh_user}", :password => "#{ssh_password}") do |ssh|
		Rails.logger.info "ssh logged in successfully"
		ssh.open_channel do |channel|
		  pwd_correct = true
		 
		  #result of standard output of send_data
		  channel.on_data do |ch, data|
			Rails.logger.info "open_channel: #{data}"
		  end

		  #result of standard error send_data
		  channel.on_extended_data do |ch, type, data| 
			Rails.logger.info "on_extended_data: #{data}"
			if data.include? "Permission denied"
			  permisson_correct = false
			else 
			  result = data
			end
		  end

		  input_data = input_data.gsub(/(\$)/, '$ ')
		  channel.exec("tcsh -l") do |ch, success|
			if success
			  if is_unix_app
				ch.send_data("#{remove_existing_unixapp}\n")
				ch.send_data("#{copy_unixapp_template}\n")
				ch.send_data("printf \"#{input_data}\" > #{input_name}\n")
			  else
				ch.send_data("umask 000\n")
				ch.send_data("#{app_name}\n") #app_name: mkdir -p ...
				ch.send_data("#{make_bin_folder}\n") # mkdir -p
				script_names.each do |name|  #create 777 empty script file
				  ch.send_data("touch #{bin_folder}/#{name}\n")
				  ch.send_data("chmod 777 #{bin_folder}/#{name}\n")
				end
				ch.send_data("umask 111\n")
				ch.send_data("printf \"#{input_data}\" > #{input_name}\n")
				ch.send_data("sed -i 's/$ )/$)/g' #{input_name}\n") #for "$ )"
				ch.send_data("umask 022\n")
			  end
			  ch.send_data("cat #{input_name}\n")
			  ch.process
			  ch.eof!
			else
			  Rails.logger.info "channel request error"
			end
		  end

		  channel.on_request "exit-status" do |ch, data|
			Rails.logger.info "exit status: #{data.read_long}"
		  end
		end

		ssh.loop
	  end  #ssh end

	  Net::SCP.start("#{deploy_host}", "#{ssh_user}", :password => "#{ssh_password}") do |scp|
		for num in 0..script_names.length-1 do
		  data = script_data.at(num)
		  name = script_names.at(num)
		  scp.upload! StringIO.new("#{data}"), "#{bin_folder}/#{name}"
		end
	  end

	  if !permisson_correct
		result = "wrongpermission"
	  end

	  rescue
		if result == "starts"
		  result = "errorbeforelogin"
		else
		  result = "fails"
		  if !pwd_correct
			result = "wrongpassword"
		  end
		end
		Rails.logger.info "rescues create_deployment_app function"
	  ensure
		Rails.logger.info "completes create_deployment_app function"
	  end
	  return(result)
	end

  end
