require 'open-uri'
require 'net/http'


class SplunkUser < ActiveRecord::Base
has_many :input_logs
	def approveuser(user_id,env,password,splunk_host)
		begin
			Rails.logger.info "enters approveuser function"
			splunk_url="https://"+splunk_host+":80/services/"
			splunkuser=SplunkUser.where(["id = ?", user_id]).first
			user=CreateUser.where(["id=?",splunkuser.create_user_id]).first
			# Build the Values required for saving at SPLUNK ENDPOINT
			@app=user.splunk_user_name
			@app_name=@app[5,(@app.length-1)]
			@role_name=user.splunk_user_name
			@tag="tag_"+@app_name
			@user_name=user.splunk_user_name
			@email=user.email
			# END OF CREATING VARIABLES
			### create app
			uri = URI.parse(splunk_url+"apps/local")
			# Full control
			http = Net::HTTP::Proxy(CONF["proxy_host"], CONF["proxy_port"])
			http = http.new(uri.host, uri.port)
			request = Net::HTTP::Post.new(uri.request_uri)
			request.basic_auth CONF["splunk_admin_user_name"], CONF["splunk_admin_password"]
			request.set_form_data({"name" => @app_name })
			## Following line calls the remote API
			response = http.request(request)
			Rails.logger.info "completes app creation"
			### create role
			uri = URI.parse(splunk_url+"authorization/roles")
			http = Net::HTTP::Proxy(CONF["proxy_host"], CONF["proxy_port"])
			http = http.new(uri.host, uri.port)
			request = Net::HTTP::Post.new(uri.request_uri)
			request.basic_auth CONF["splunk_admin_user_name"], CONF["splunk_admin_password"]
			request.set_form_data({"name" => @role_name,"defaultApp" => @app_name, "srchFilter" => "tag=#{@tag}", "srchIndexesDefault" => "*", "srchIndexesAllowed" => ['*','_*']})
			## Following line calls the remote API
			response = http.request(request)
			Rails.logger.info "completes role creation"
			### create user
			uri = URI.parse(splunk_url+"authentication/users")
			# Full control
			http = Net::HTTP::Proxy(CONF["proxy_host"], CONF["proxy_port"])
			http = http.new(uri.host, uri.port)
			request = Net::HTTP::Post.new(uri.request_uri)
			request.basic_auth CONF["splunk_admin_user_name"], CONF["splunk_admin_password"]
			request.set_form_data({"name" => @user_name,"password" => password,"defaultApp" => @app_name, "roles" => [@user_name,'func_user'],"email" => @email})
			## Following line calls the remote API
			response = http.request(request)
			Rails.logger.info "completes user creation"
			splunkuser.status=1
			splunkuser.save
			SupportMail.requestapproveinformadmin_email(user, splunkuser.env, splunk_host, splunkuser.rpaas_user_name, splunkuser.memo, splunkuser.id).deliver
				 #SupportMail.requestapprove_email(user, splunkuser.email, splunkuser.env, splunk_host, splunkuser.rpaas_user_name, splunkuser.memo).deliver
			sleep(1)
			result="success"
		rescue
			result="fails"
			Rails.logger.info "rescues approveuser function"
		ensure
			Rails.logger.info "completes approveuser function"
		end
		return result
	end

	def create_new_user(password,rpaas_user_name,memo,env,splunk_host_name,id,current_user)
		begin
			result="fails"
			Rails.logger.info "enters create_new_user function"
			save_this_user=SplunkUser.new
			role="SH"
			splunk_host=SplunkHosts.select(:id).where(["name=? and role=?",splunk_host_name,role]).first
			save_this_user.rpaas_user_name=rpaas_user_name
			save_this_user.memo=memo
			save_this_user.env=env
			save_this_user.create_user_id=id
			save_this_user.status=0
			save_this_user.splunk_host_id=splunk_host.id
			current_user=CreateUser.where(["id=?",current_user]).first
			save_this_user.save
			result=save_this_user
		rescue
			result="fails"
			Rails.logger.info "rescues create_new_user function"
		ensure
			Rails.logger.info "completes create_new_user function"
		end
		return(result)
	end

	def check_if_exists(create_user_id,env)
		begin
				result="yes"
				Rails.logger.info "enter SplunkUser check_if_exists function"
				account=SplunkUser.where(["create_user_id=? and env=?",create_user_id,env]).first
				if account==nil
					result="no"
				else
					result=account.id
				end
		rescue
				Rails.logger.info "rescues SplunkUser check_if_exists function"
		ensure
				Rails.logger.info "completes SplunkUser check_if_exists function"
		end
		return(result)
	end

	def get_record(record_id)
		begin
			Rails.logger.info "enters get_record function"
			get_record=SplunkUser.where(["id=?",record_id]).first
			result=get_record
		rescue
			result="failed"
			Rails.logger.info "rescues get_record function"
		ensure
			Rails.logger.info "completes get_record function"
		end
		return(result)
	end

	def get_all_records_for_sh_by_id(record_id)
		begin
			Rails.logger.info "enters get_all_records_for_sh_by_id function"
			get_records=SplunkUser.where(["splunk_host_id=?",record_id])
			result=get_records
		rescue
			result="failed"
			Rails.logger.info "rescues get_all_records_for_sh_by_id function"
		ensure
			Rails.logger.info "completes get_all_records_for_sh_by_id function"
		end
		return(result)
	end

	def get_all_records_for_sh_by_name(record_name)
		begin
			Rails.logger.info "enters get_all_records_for_sh_by_name function"
			get_host_id=SplunkHosts.select(:id).where(["name=? and role=?",record_name,"SH"]).first
			get_records=SplunkUser.where(["splunk_host_id=?",get_host_id.id])
			result=get_records
		rescue
			result="failed"
			Rails.logger.info "rescues get_all_records_for_sh_by_name function"
		ensure
			Rails.logger.info "completes get_all_records_for_sh_by_name function"
		end
		return(result)
	end


	def get_all_records_for_user_by_id(record_id)
		begin
			Rails.logger.info "enters get_all_records_for_user_by_id function"
			get_records=SplunkUser.where(["create_user_id=?",record_id])
			result=get_records
		rescue
			result="failed"
			Rails.logger.info "rescues get_all_records_for_user_by_id  function"
		ensure
			Rails.logger.info "completes get_all_records_for_user_by_id  function"
		end
		return(result)
	end

	def get_users_statistics
		begin
			Rails.logger.info "enters get_users_statistics function"
			result="starts"
			statistics=Array.new
			get_statistics=SplunkUser.new
			dev_statistics=get_statistics.get_env_statistics("dev")
			statistics.push(dev_statistics)
			stg_statistics=get_statistics.get_env_statistics("stg")
			statistics.push(stg_statistics)
			prod_statistics=get_statistics.get_env_statistics("prod")
			statistics.push(prod_statistics)
			result=statistics
		rescue
			result="failed"
			Rails.logger.info "rescues get_users_statistics function"
		ensure
			Rails.logger.info "completes get_users_statistics function"
		end
		return(result)
	end

	def get_env_statistics(env)
		begin
			Rails.logger.info "enters get_env_statistics function"
			result="starts"
			statistics=Array.new
			env_statistics=SplunkUser.select(:status).where(["env=?",env])
			users_count=0
			accepted_count=0
			rejected_count=0
			pending_count=0
			env_statistics.each do |user|
				if user.status==0
					pending_count+=1
				elsif user.status==1
					accepted_count+=1
				elsif user.status==9
					rejected_count+=1
				end
				users_count+=1
			end
			users_count_array=Array.new
			accepted_count_array=Array.new
			rejected_count_array=Array.new
			pending_count_array=Array.new
			users_label_array=Array.new
			env_array=Array.new
			env_label_array=Array.new
			accepted_label_array=Array.new
			rejected_label_array=Array.new
			pending_label_array=Array.new
			users_label_array.push("Splunk Users")
			env_label_array.push("Environment")
			accepted_label_array.push("Users Accepted")
			rejected_label_array.push("Users Canceled")
			pending_label_array.push("Pending users")
			users_count_array.push(users_count)
			accepted_count_array.push(accepted_count)
			rejected_count_array.push(rejected_count)
			pending_count_array.push(pending_count)
			env_array.push(env)
			users_label_array=users_label_array.zip(users_count_array)
			accepted_label_array=accepted_label_array.zip(accepted_count_array)
			rejected_label_array=rejected_label_array.zip(rejected_count_array)
			pending_label_array=pending_label_array.zip(pending_count_array)
			env_label_array=env_label_array.zip(env_array)
			statistics.push(env_label_array)
			statistics.push(users_label_array)
			statistics.push(accepted_label_array)
			statistics.push(rejected_label_array)
			statistics.push(pending_label_array)
			result=statistics
		rescue
			result="failed"
			Rails.logger.info "rescues get_env_statistics function"
		ensure
			Rails.logger.info "completes get_env_statistics function"
		end
		return(result)
	end

	def get_current_user_accounts_count(current_user)
		begin
			Rails.logger.info "enters current_user_accounts_count function"
			result="starts"
			col_one="id"
			col_two="splunk_host_id"
			testing =SplunkUser.select(col_one,col_two)
			user_accounts = SplunkUser.where(["create_user_id= ?", current_user])
			test_dev=0
			test_stg=0
			test_prod=0
			user_accounts.each do |account|
				if(account.env=="dev")
					test_dev=1
				elsif(account.env=="stg")
					test_stg=1
				elsif(account.env=="prod")
					test_prod=1
				end
			end
		rescue
			result="fails"
			Rails.logger.info "rescues current_user_accounts_count function"
		ensure
			Rails.logger.info "completes current_user_accounts_count function"
		end
		return test_prod,test_stg,test_dev
	end

	def get_record_for(attribute,where_attribute,where_value)
		begin
			result="starts"
			Rails.logger.info "enters get_record_for #{attribute} function"
			get_record_for = SplunkUser.where(["#{where_attribute} = ?",where_value]).select(attribute).first
			result= get_record_for
		rescue
			result="fails"
			Rails.logger.info "rescues get_record_for #{attribute} function"
		ensure
			Rails.logger.info "completes get_record_for #{attribute} function"
		end
		return(result)
	end


	def get_all_records_for(attribute)
		begin
			result="starts"
			Rails.logger.info "enters get_all_records_for function #{attribute}"
			get_all_records_for = SplunkUser.select(attribute)
			result= get_all_records_for
		rescue
			result="fails"
			Rails.logger.info "rescues get_all_records_for function #{attribute}"
		ensure
			Rails.logger.info "completes get_all_records_for function #{attribute}"
		end
		return(result)
	end


	def get_splunk_user_for_input_log(id_attribute,env_attribute,env_value,user_attribute,user_value)
		begin
			Rails.logger.info "enters get_splunk_user_for_input_log function"
			result="starts"
			get_splunk_user = SplunkUser.where(["#{env_attribute} = ? and #{user_attribute} = ?",env_value, user_value]).select(id_attribute).first
			result= get_splunk_user
		rescue
			result="fails"
			Rails.logger.info "rescues get_splunk_user_for_input_log function"
		ensure
			Rails.logger.info "completes get_splunk_user_for_input_log function"
		end
		return(result)
	end

	def get_splunk_account(splunk_user_id)
		begin
			Rails.logger.info "enters get_splunk_account function"
			result = "starts"
			get_splunk_host_name = SplunkHosts.new
			splunk_account = SplunkUser.select(:rpaas_user_name, :memo, :splunk_host_id, :create_user_id, :status).where(["id = ?", splunk_user_id]).first
			splunk_host_name = get_splunk_host_name.get_record_for("name","id",splunk_account.splunk_host_id)
			user_account_details = CreateUser.where(["id = ?", splunk_account.create_user_id]).first
		rescue
			result = "fails"
			Rails.logger.info "rescues get_splunk_account function"
		ensure
			Rails.logger.info "completes get_splunk_account function"
		end
		return user_account_details, splunk_account, splunk_host_name
	end

	def is_a_splunk_user(portal_user_id, env)
		begin
			Rails.logger.info " is_a_splunk_user function"
			result = "starts"
			is_a_user = SplunkUser.where("create_user_id = ? and env = ?", portal_user_id, env).count
			result = is_a_user
		rescue
			result = "fails"
			Rails.logger.info " is_a_splunk_user function"
		ensure
			Rails.logger.info " is_a_splunk_user function"
		end
		return(result)
	end

end
