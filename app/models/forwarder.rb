require 'open-uri'
require 'net/http'

class Forwarder < ActiveRecord::Base

	def get_all_records_by_env(env,created_by)
		begin
			Rails.logger.info "enters get_all_records_by_env function"
			get_records=Forwarder.select(:id,:name,:created_at).where(["env=? and create_user_id=?",env,created_by]).order(:name)
			result=get_records
		rescue
			result="failed"
			Rails.logger.info "rescues get_all_records_by_env function"
		ensure
			Rails.logger.info "completes get_all_records_by_env function"
		end
		return(result)
	end

	def add_record(name,env,created_by)
		begin
			Rails.logger.info "enters add_record function"
			result="starts"
			record=Forwarder.new
			record.name=name
			record.env=env
			record.create_user_id=created_by
			record.save
			result="success"
		rescue
			result="failed"
			Rails.logger.info "rescues add_record function"
		ensure
			Rails.logger.info "completes add_record function"
		end
		return(result)
	end


	def edit_record(name,id)
		begin
			Rails.logger.info "enters edit_record function"
			result="starts"
			record=Forwarder.where(["id=?",id]).first
			record.name=name
			record.save
			result="success"
		rescue
			result="failed"
			Rails.logger.info "rescues edit_record function"
		ensure
			Rails.logger.info "completes edit_record function"
		end
		return(result)
	end


	def delete_record(id)
		begin
			Rails.logger.info "enters delete_record function"
			result="starts"
			delete_reference_for_server_class = ServerClassForwarder.new
			record=Forwarder.where(["id=?",id]).first
			delete_reference_for_server_class = delete_reference_for_server_class.delete_records_for("forwarder_id",id)
			record.delete
			result="success"
		rescue
			result="failed"
			Rails.logger.info "rescues delete_record function"
		ensure
			Rails.logger.info "completes delete_record function"
		end
		return(result)
	end

	def get_all_forwarder_names_by_env(env,created_by)
		begin
			Rails.logger.info "enters get_all_forwarder_names_by_env function"
			get_records=Forwarder.select(:name).where(["env=? and create_user_id=?",env,created_by]).order(:name)
			forwarder_names=Array.new
			get_records.each do |record|
				forwarder_names.push(record.name)
			end
			result=forwarder_names
		rescue
			result="failed"
			Rails.logger.info "rescues get_all_forwarder_names_by_env function"
		ensure
			Rails.logger.info "completes get_all_forwarder_names_by_env function"
		end
		return(result)
	end

	def get_forwarders_count(env,created_by)
		begin
			Rails.logger.info "enters get_forwarders_count"
			result="started"
			get_count=Forwarder.where(["create_user_id=? and env=?",created_by,env]).count
			result=get_count
		rescue
		 result="failed"
			Rails.logger.info "rescues get_forwarders_count"
		ensure
			Rails.logger.info "completes get_forwarders_count"
		end
		return(result)
	end

	def get_records_for_admin
		begin
			Rails.logger.info "enters get_records_for_admin function"
			get_records=Forwarder.select(:id,:name,:created_at,:env,:create_user_id)
			get_splunk_user_name= CreateUser.new
			get_records.each do |record|
				splunk_user_name = get_splunk_user_name.get_record_for("splunk_user_name","id",record.create_user_id)
				record.env+=splunk_user_name.splunk_user_name
			end
			result=get_records
		rescue
			result="failed"
			Rails.logger.info "rescues get_records_for_admin function"
		ensure
			Rails.logger.info "completes get_records_for_admin function"
		end
		return(result)
	end

	def suggest_changes(id,new_name)
		begin
			Rails.logger.info "enters suggest_changes function"
			record=Forwarder.where(["id=?",id]).first
			get_user_details=CreateUser.new
			email=get_user_details.get_record_for("email","id",record.create_user_id)
			email=email.email
			user_name=get_user_details.get_record_for("splunk_user_name","id",record.create_user_id)
			user_name=user_name.splunk_user_name
			SupportMail.forwardersuggestchange_email(user_name,record.env,email,new_name,record.name).deliver
		rescue
			Rails.logger.info "rescues suggest_changes function"
		ensure
			Rails.logger.info "completes suggest_changes function"
		end
	end

	def get_record_for(attribute,where_attribute,where_value)
		begin
			result="starts"
			Rails.logger.info "enters get_record_for #{attribute} function"
			get_record_for = Forwarder.where(["#{where_attribute} = ?",where_value]).select(attribute).first
			result= get_record_for
		rescue
			result="fails"
			Rails.logger.info "rescues get_record_for #{attribute} function"
		ensure
			Rails.logger.info "completes get_record_for #{attribute} function"
		end
		return(result)
	end


	def get_records_for(attribute,where_attribute,where_value)
		begin
			result="starts"
			Rails.logger.info "enters get_records_for #{attribute} function"
			get_records_for = Forwarder.where(["#{where_attribute} = ?",where_value]).select(attribute).order("#{attribute}")
			result= get_records_for
		rescue
			result="fails"
			Rails.logger.info "rescues get_record_for #{attribute} function"
		ensure
			Rails.logger.info "completes get_records_for #{attribute} function"
		end
		return(result)
	end

	def get_forwarders_from_deployment_server(env)
		begin
			Rails.logger.info "enters get_forwarders_from_deployment_server function"
			result="starts"
			forwarders=Array.new
			get_deploy_host = SplunkHosts.new
			deploy_hosts = get_deploy_host.get_all_deploy_hosts_names_for_env("env",env,"role","DPLY")
			deploy_hosts.each do |deploy_host|
				uri = URI.parse("http://"+deploy_host+":80/services/deployment/server/clients?count=0")
				http = Net::HTTP::Proxy(CONF["proxy_host"], CONF["proxy_port"])
				http = http.new(uri.host, uri.port)
				request = Net::HTTP::Get.new(uri.request_uri)
				request.basic_auth CONF["splunk_admin_user_name"], CONF["splunk_admin_password"]
				response = http.request(request)
				response.body.each_line do |lines|
					if lines =~ /key name="hostname"/
						forwarders.push(lines[31...-9])
					end
				end
			end
			result=forwarders
		rescue
			Rails.logger.info "rescues get_forwarders_from_deployment_server function"
			result="fails"
		ensure
			Rails.logger.info "completes get_forwarders_from_deployment_server function"
		end
		return(result)
	end

	def has_associated_server_class ( forwarder_id )
		begin
			Rails.logger.info "enters has associated server class function"
			result = "starts"
			get_count = ServerClassForwarder.select(:id).where(["forwarder_id = ?", forwarder_id]).count
			result = get_count
		rescue
			result = "fails"
			Rails.logger.info "rescues has associated server class function"
		ensure
			Rails.logger.info "completes has associated server class function"
		end
		return(result)
	end

	def sort_array(target_array, type)
		begin
			Rails.logger.info "enters sort_array #{type} function"
			result = "starts"
			
		rescue
			result = "fails"
			Rails.logger.info "rescues sort_array #{type} function"
		ensure
			Rails.logger.info "completes sort_array #{type} function"
		end
	end


end
