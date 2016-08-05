require 'open-uri'
require 'net/http'
require 'http_requests'
require 'nokogiri'
class ServerClass < ActiveRecord::Base

	def add_record(user, class_name, regex, env, all_forwarders)
	begin
		Rails.logger.info "enters add_record function"
		result="starts"
		add_record=ServerClass.new
		class_name.gsub! "\s", "-"
		add_record.name = class_name
		add_record.env = env
		add_record.regex = ""
		add_record.create_user_id = user
		add_record.save
		forwarders=all_forwarders.split("|")
		#get_forwarders_id = Forwarder.new
		add_ref_to_forwarder= ServerClassForwarder.new
		forwarders.each do |forwarder|
		id=Forwarder.select("id").where(["name = ? and create_user_id = ?",forwarder, user]).first
		add_ref_to_forwarder.add_record(add_record.id,id.id)
		end
		result="success"
	rescue
		result="fails"
		Rails.logger.info "rescues add_record function"
	ensure
		Rails.logger.info "completes add_record function"
	end
	return(result)
	end

	def get_all_records_of_user_for(user,where_attribute,where_value)
	begin
		Rails.logger.info "enters get_all_records_of_user_for #{where_attribute} function"
		result="starts"
		all_records= ServerClass.where(["#{where_attribute} = ? and create_user_id = ?", where_value, user]).order(:name)
		result=all_records
	rescue
		result="fails"
		Rails.logger.info "rescues get_all_records_of_user_for #{where_attribute} function"
	ensure
		Rails.logger.info "completes get_all_records_of_user_for #{where_attribute} function"
	end
	return(result)
	end


	def get_record_of_user_for(user,where_attribute,where_value)
	begin
		Rails.logger.info "enters get_record_of_user_for #{where_attribute} function"
		result="starts"
		record= ServerClass.where(["#{where_attribute} = ? and create_user_id = ?", where_value, user]).first
		result=record
	rescue
		result="fails"
		Rails.logger.info "rescues get_record_of_user_for #{where_attribute} function"
	ensure
		Rails.logger.info "completes get_record_of_user_for #{where_attribute} function"
	end
	return(result)
	end

	def get_forwarders(user,env,server_class)
	begin
		Rails.logger.info "enters get_forwarders function"
		result="starts"
		get_class_forwarders = ServerClassForwarder.new
		class_forwarders=get_class_forwarders.get_all_records_for("forwarder_id","server_class_id",server_class)
		forwarder=Array.new
		get_forwarder_name = Forwarder.new
		class_forwarders.each do |class_forwarder|
		name=get_forwarder_name.get_record_for("name","id",class_forwarder.forwarder_id)
		forwarder.push(name.name)
		end
		result=forwarder
	rescue
		result="fails"
		Rails.logger.info "rescues get_forwarders function"
	ensure
		Rails.logger.info "completes get_forwarders function"
	end
	return(result)
	end

	def delete_record(record_id)
	begin
		Rails.logger.info "enters delete_record function"
		result="starts"
		delete_deploy_setting_records = DeploySetting.new
		get_delete_record = ServerClass.where(["id = ?",record_id]).first
		delete_server_class_clients = ServerClassForwarder.new
		result=delete_server_class_clients.delete_records_for("server_class_id",record_id)
		if result=="success"
		get_delete_record.delete
		result="success"
		result = delete_deploy_setting_records.delete_records_for("server_class_id", record_id)
		else
		Rails.logger.info "Fails to delete Server Class Clients"
		result="fails"
		end
	rescue
		result="fails"
		Rails.logger.info "rescues delete_record function"
	ensure
		Rails.logger.info "completes delete_record function"
	end
	return(result)
	end

	def get_record_for(attribute,where_attribute,where_value)
	begin
		result="starts"
		Rails.logger.info "enters get_record_for #{attribute} function"
		get_record_for = ServerClass.where(["#{where_attribute} = ?",where_value]).select(attribute).first
		result= get_record_for
	rescue
		result="fails"
		Rails.logger.info "rescues get_record_for #{attribute} function"
	ensure
		Rails.logger.info "completes get_record_for #{attribute} function"
	end
	return(result)
	end

	def create_server_class(app_id, deploy_host, white_list, server_classes)
	begin
		Rails.logger.info "enters create_server_class function"
		result = "starts"
		get_app_details = App.new
		get_user_details = CreateUser.new
		get_host_details = SplunkHosts.new
		deploy_host_id = SplunkHosts.where(["role = ? and name = ?","DPLY", deploy_host]).select(:id).first
		add_host_ref_to_app = App.new
		server_classes = server_classes.split("\n")
		white_list = white_list.split("|")
		app_name = get_app_details.get_record_for("name","id",app_id)
		user_id = get_app_details.get_record_for("create_user_id","id",app_id)
		user_name = get_user_details.get_record_for("splunk_user_name","id",user_id.create_user_id)
		index = 0
		http_helper_object = HttpHelper.new
		server_classes.each do |server_class|
		request = http_helper_object.request_create_get("http://"+ deploy_host +":80/services/deployment/server/serverclasses/sc_"+user_name.splunk_user_name+"_"+server_class)
		request = http_helper_object.request_set_auth_basic(request, CONF["splunk_admin_user_name"], CONF["splunk_admin_password"])
		response = http_helper_object.request_send("http://"+ deploy_host +":80/services/deployment/server/serverclasses/sc_"+user_name.splunk_user_name+"_"+server_class, request)
		whitelist_count = -1
		if response.code == "200"
			response.body.each_line do |body|
			if body =~ /whitelist-size/
				whitelist_count =  body.slice(37...38).to_i
			end
			end
		else
			uri = URI.parse("http://"+ deploy_host +":80/services/deployment/server/serverclasses")
			http = Net::HTTP::Proxy(CONF["proxy_host"], CONF["proxy_port"])
			http = http.new(uri.host, uri.port)
			request = Net::HTTP::Post.new(uri.request_uri)
			request = http_helper_object.request_create_post("http://"+ deploy_host +":80/services/deployment/server/serverclasses")
			request.basic_auth CONF["splunk_admin_user_name"], CONF["splunk_admin_password"]
			request.set_form_data({"name" => "sc_"+user_name.splunk_user_name+"_"+server_class})
			response = http.request(request)
		end
		uri = URI.parse("http://"+ deploy_host +":80/services/deployment/server/serverclasses/sc_"+user_name.splunk_user_name+"_"+server_class )
		http = Net::HTTP::Proxy(CONF["proxy_host"], CONF["proxy_port"])
		http = http.new(uri.host, uri.port)
		request = Net::HTTP::Post.new(uri.request_uri)
		request.basic_auth CONF["splunk_admin_user_name"], CONF["splunk_admin_password"]
		temp_index = 0
		white_list_parameter = {}
		if white_list[index].index(',') == nil
			 white_list_parameter["whitelist.0"] = white_list[index]
			temp_index = 1
			while temp_index < whitelist_count do
			white_list_parameter["whitelist.#{temp_index}"] = " "
			temp_index += 1
			end
		else
			temp_white_list = white_list[index].split(",")
			temp_white_list.each do |tempwhitelist|
			if tempwhitelist[0] == " "
				tempwhitelist[0] = ""
			end
			white_list_parameter["whitelist.#{temp_index}"] = tempwhitelist
			temp_index += 1
			end
			while temp_index < whitelist_count do
			white_list_parameter["whitelist.#{temp_index}"] = " "
			temp_index += 1
			end
		end
		white_list_parameter["restartSplunkd"] = "true"
		request.set_form_data(white_list_parameter)
		#request.set_form_data("restartSplunkd" => "true" )
		response = http.request(request)
		uri = URI.parse("http://"+ deploy_host +":80/services/deployment/server/applications/dsapp_"+user_name.splunk_user_name+"_"+ app_name.name)
		http = Net::HTTP::Proxy(CONF["proxy_host"], CONF["proxy_port"])
		http = http.new(uri.host, uri.port)
		request = Net::HTTP::Post.new(uri.request_uri)
		request.basic_auth CONF["splunk_admin_user_name"], CONF["splunk_admin_password"]
		request.set_form_data({"serverclass" => "sc_"+user_name.splunk_user_name+"_"+server_class, "restartSplunkd" => "true" })
		response = http.request(request)
		index+= 1
		end
		add_host_ref_to_app.add_deploy_host_ref(app_id, deploy_host_id.id)
		
		result = "Server Class Created on #{deploy_host} !!"
	rescue
		result = "fails"
		Rails.logger.info "rescues create_server_class function"
	ensure
		Rails.logger.info "completes create_server_class function"
	end
	return(result)
	end

	def update_server_class (server_class_id, server_class_name, server_class_regex)
	begin
		Rails.logger.info "enters update_server_class function"
		result = "starts"
		record = ServerClass.where(["id = ?",server_class_id]).first
		server_class_name.gsub! "\s", "-"
		record.name = server_class_name
		record.regex = server_class_regex
		record.save
		result = "success"
	rescue
		result = "fails"
		Rails.logger.info "rescues update_server_class function"
	ensure
		Rails.logger.info "completes update_server_class function"
	end
	return(result)
	end

	def has_associated_app ( server_class_id )
	begin
		Rails.logger.info "enters has associated app function"
		result = "starts"
		get_apps = DeploySetting.select(:app_id).where(["server_class_id = ?", server_class_id])
		get_app_details = App.new
		flag_is_associated = 0
		get_apps.each do |get_app|
		status = get_app_details.get_record_for("deploy_status","id",get_app.app_id)
		if status.deploy_status == 1 or status.deploy_status == 2
			flag_is_associated = 1
			break
		end
		end
		if flag_is_associated == 1
		result = 10
		else
		result = 0
		end
	rescue
		result = "fails"
		Rails.logger.info "rescues has associated app function"
	ensure
		Rails.logger.info "completes has associated app function"
	end
	return(result)
	end

	def get_record (where_attribute, where_value)
	begin
		Rails.logger.info "enters get_record #{where_attribute} function"
		result = "starts"
		all_records = ServerClass.where("#{where_attribute} = ?", where_value).first
		result = all_records
	rescue
		result = "fails"
		Rails.logger.info "rescues get_record #{where_attribute} function"
	ensure
		Rails.logger.info "completes get_record #{where_attribute} function"
	end
	return(result)
	end

	def get_tags(search_host,user)
	begin
		Rails.logger.info "enters get_tags function"
		result = "starts"
		http_helper_object = HttpHelper.new
		#url_string = "http://#{search_host}:80/servicesNS/admin/search/search/fields/host/tags"
		url_string = "http://#{search_host}:80/servicesNS/admin/search/search/tags"
		request = http_helper_object.request_create_get(url_string)
		request = http_helper_object.request_set_auth_basic(request, CONF["splunk_admin_user_name"], CONF["splunk_admin_password"])
		response = http_helper_object.request_send(url_string, request)
		xml_doc = Nokogiri::XML(response.body)      
		my_array = xml_doc.search("title")
		tag_names = Array.new
		my_array.each do |tag_name|
		tags = {}
		tag_name = tag_name.to_s
		tag_name.slice!(0..6)
		next if tag_name.index("tag_") == nil
		#puts tag_name.slice!(0..(tag_name.index(":")-1))
		#puts tag_name
		#puts tag_name.index(":")
		#puts tag_name.slice(2..(tag_name.index("<")-1))
		tag = tag_name.slice!(0..(tag_name.index("<")-1))
		url_string = "http://#{search_host}:80/servicesNS/admin/search/search/tags/#{tag}"
		request = http_helper_object.request_create_get(url_string)
		request = http_helper_object.request_set_auth_basic(request, CONF["splunk_admin_user_name"], CONF["splunk_admin_password"])
		response = http_helper_object.request_send(url_string, request)
		xml_host_doc = Nokogiri::XML(response.body)
		my_host_array = xml_host_doc.search("title")
		my_tag_host_list = ""
		my_host_array.each do |tag_hosts|
			tag_hosts = tag_hosts.to_s
			next if tag_hosts.index("host") == nil
			tag_hosts.slice!(0..tag_hosts.index(":")+1)
			my_tag_host_list += tag_hosts.slice(0..(tag_hosts.index("<")-1)) + ","
		end
		tags["host"] = my_tag_host_list
		tags["name"] = tag
		tags["user"] = user
		tag_names.push(tags)
		end
		result = tag_names
	rescue
		result = "fails"
		Rails.logger.info "rescues get_tags function"
	ensure
		Rails.logger.info "completes get_tags function"
	end
	return(result)
	end

	def create_tag(tag_name, search_host, host_names)
	begin
		Rails.logger.info "enters create_tag function"
		result = "starts"
		http_helper_object = HttpHelper.new
		if search_host == CONF["search_head_cluster_vip"]
			searchHosts = CONF["search_head_cluster"]
			listSearchHosts = searchHosts.split(",")
			search_host = listSearchHosts[0]
		end
		url_string = "http://#{search_host}:80/servicesNS/admin/search/search/tags/#{tag_name}"
		if host_names.index(",") == nil
		request = http_helper_object.request_create_post(url_string)
		request = http_helper_object.request_set_auth_basic(request, CONF["splunk_admin_user_name"], CONF["splunk_admin_password"])
		request.set_form_data({"add" => "host::#{host_names}" })
		response = http_helper_object.request_send(url_string, request)
		else
		list_host_names = host_names.split(",")
		list_host_names.each do |iterate_host_name|
			iterate_host_name.gsub! "\s", ""
			request = http_helper_object.request_create_post(url_string)
			request = http_helper_object.request_set_auth_basic(request, CONF["splunk_admin_user_name"], CONF["splunk_admin_password"])
			request.set_form_data({"add" => "host::#{iterate_host_name}"})
			response = http_helper_object.request_send(url_string, request)
		end
		end

		change_tag_permission(tag_name, search_host, host_names)
		problematic_hosts = verify_tag_permission_success(search_host, host_names)
		result = "success"
		if problematic_hosts != ""
		result = "Need to change permission for: " + problematic_hosts
		end
	rescue
		result = "fails"
		Rails.logger.info "rescues create_tag function"
	ensure
		Rails.logger.info "completes create_tag function"
	end
	return(result)
	end

	def change_tag_permission(tag_name, search_host, host_names)
	begin
		Rails.logger.info "enters change_tag_permission function"
		result = "starts"
		http_helper_object = HttpHelper.new
		if host_names.index(",") == nil
		url_string = "http://#{search_host}:80/servicesNS/admin/search/saved/fvtags/host=#{host_names}/acl"
		request = http_helper_object.request_create_post(url_string)
		request = http_helper_object.request_set_auth_basic(request, CONF["splunk_admin_user_name"], CONF["splunk_admin_password"])
		request.set_form_data({"owner" => "admin", "sharing" => "global", "perms.write" => "admin", "perms.read" => "*"})
		response = http_helper_object.request_send(url_string, request)
		else
		list_host_names = host_names.split(",")
		list_host_names.each do |iterate_host_name|
			iterate_host_name.gsub! "\s", ""
			url_string = "http://#{search_host}:80/servicesNS/admin/search/saved/fvtags/host=#{iterate_host_name}/acl"
			request = http_helper_object.request_create_post(url_string)
			request = http_helper_object.request_set_auth_basic(request, CONF["splunk_admin_user_name"], CONF["splunk_admin_password"])
			request.set_form_data({"owner" => "admin", "sharing" => "global", "perms.write" => "admin", "perms.read" => "*"})
			response = http_helper_object.request_send(url_string, request)
		end
		end
		result = "success"
	rescue
		result = "fails"
		Rails.logger.info "rescues change_tag_permission function"
	ensure
		Rails.logger.info "completes change_tag_permission function"
	end
	return(result)
	end

	def verify_tag_permission_success(search_host, host_names)
	begin
		Rails.logger.info "enters verify_tag_permission_success function"
		result = ""
		problematic_hosts = ""
		http_helper_object = HttpHelper.new
		if host_names.index(",") == nil
		url_string = "http://#{search_host}:80/servicesNS/admin/search/saved/fvtags/host=#{host_names}/acl"
		request = http_helper_object.request_create_get(url_string)
		request = http_helper_object.request_set_auth_basic(request, CONF["splunk_admin_user_name"], CONF["splunk_admin_password"])
		response = http_helper_object.request_send(url_string, request)
		response.body.each_line do |line|
			if line =~ /key name="sharing">user/ #failed
			problematic_hosts = host_names
			end  
		end  
		else
		list_host_names = host_names.split(",")
		list_host_names.each do |iterate_host_name|
			iterate_host_name.gsub! "\s", ""
			url_string = "http://#{search_host}:80/servicesNS/admin/search/saved/fvtags/host=#{iterate_host_name}/acl"
			request = http_helper_object.request_create_get(url_string)
			request = http_helper_object.request_set_auth_basic(request, CONF["splunk_admin_user_name"], CONF["splunk_admin_password"])
			response = http_helper_object.request_send(url_string, request)
			response.body.each_line do |line|
			if line =~ /key name="sharing">user/ #failed
				problematic_hosts = problematic_hosts + iterate_host_name + ","
			end  
			end  
		end
		end
		result = problematic_hosts
	rescue
		result = ""
		Rails.logger.info "rescues verify_tag_permission_success function"
	ensure
		Rails.logger.info "completes verify_tag_permission_success function"
	end
	return(result)
	end

end
