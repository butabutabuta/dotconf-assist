require 'logger'
require 'json'
#require 's3ops'
Rails.logger = Logger.new(Rails.root.join("log","splunk_users_controller.log"))
Rails.logger.level = 1

class SplunkUsersController < ApplicationController
	POST_ONLY_ACTIONS = [:setupinputconfirm, :test]
	protect_from_forgery except: :display
	before_action :set_splunk_user, only: [:show, :edit, :update, :destroy]
	before_filter :authenticate_authentication!, :except => :setupinputvalidateuser
	before_filter :must_be_post, :only => POST_ONLY_ACTIONS
	before_filter :has_splunk_account, only: [:manage_forwarders, :manage_deploy_requests, :listinputs, :get_size_and_storage]
	@@object_key="test"
	# GET /splunk_users
	# GET /splunk_users.json
	def index
		begin
			Rails.logger.info "enters index function"
			get_accounts_count=SplunkUser.new
    		@about_link = CONF["about_link"]
    		@faq_link = CONF["faq_link"]
    		@reference_link = CONF["reference_link"]
			@prod,@stg,@dev =get_accounts_count.get_current_user_accounts_count(current_authentication.create_user_id)
			@enable_size_cost_estimation_page = CONF["enable_size_cost_estimation_page"]
			if params[:env]==nil
				@env="prod"
			else
				if not ["prod","stg", "dev"].include?params[:env]
					@env="prod"
				else
					@env=params[:env]
				end
			end
			@tutorial=0
			if current_authentication.sign_in_count<2
				@tutorial=1
			end
		rescue
			Rails.logger.info "rescues index function"
		ensure
			Rails.logger.info "completes index function"
		end
	end

	# GET /splunk_users/1
	# GET /splunk_users/1.json
	def show
	end

	# GET /splunk_users/new
	def new
		begin
			Rails.logger.info "enters new account create function"
			@about_link = CONF["about_link"]
    		@faq_link = CONF["faq_link"]
    		@reference_link = CONF["create_account_link"]
			@splunk_user = SplunkUser.new
			@env=params[:env]
			@user_name=current_authentication.splunk_user_name
			Rails.logger.info "fetching hosts"
			role="SH"
			host=SplunkHosts.select(:name).where(["role=? and env=?",role,@env])
			@hosts=Array.new #used in splunk_users/new.html.erb
			host.each do |hostname|
				@hosts.push(hostname.name)
			end
			if(@env == "prod")
				@hosts.clear
				@hosts.push(CONF["search_head_cluster_vip"])
			end
		rescue
			Rails.logger.info "rescues new account create function"
		ensure
			Rails.logger.info "completes new account create function"
		end
	end

	# GET /splunk_users/1/edit
	def edit
	end

	# POST /splunk_users
	# POST /splunk_users.json
	def create
		begin
			Rails.logger.info "enters create function"
			@splunk_user = SplunkUser.new
			if params[:splunk_host]==nil
				@splunk_user="fails"
			else #save user info in database
				@splunk_user=@splunk_user.create_new_user(params[:password],params[:rpaas_user_name],params[:memo],params[:env],params[:splunk_host],current_authentication.create_user_id,current_authentication.create_user_id)
			end
			if @splunk_user!="fails" #create user in splunk host
				if params[:env] == "prod"
					searchHeads = CONF["search_head_cluster"]
					listSearchHeads = searchHeads.split(",")
					listSearchHeads.each do |searchHead|
						result=@splunk_user.approveuser(@splunk_user.id,params[:env],params[:password],searchHead)
					end
				else
					result=@splunk_user.approveuser(@splunk_user.id,params[:env],params[:password],params[:splunk_host])
				end
				
				flash[:notice]= "Account Created Successfully for " + params[:env] +" Environment !!"
				action="index"
			else
				action="new"
				flash[:notice]= "Sorry, Something went wrong !! Please Try Again or Contact US."
			end
			if result=="fails"
				flash[:notice]= "Sorry, Something went wrong !! Please Try Again or Contact US."
				action="new"
			end
		rescue
			flash[:notice]= "Sorry, Something went wrong !! Please Try Again or Contact US."
			action="new"
			Rails.logger.info "rescues create function"
		ensure
			Rails.logger.info "completes create function"
		end
		redirect_to :controller => "splunk_users", :action => action, :env=> params[:env]
	end

	# PATCH/PUT /splunk_users/1
	# PATCH/PUT /splunk_users/1.json
	def update
		respond_to do |format|
			if @splunk_user.update(splunk_user_params)
				format.html { redirect_to @splunk_user, notice: 'Splunk user was successfully updated.' }
				format.json { render :show, status: :ok, location: @splunk_user }
			else
				format.html { render :edit }
				format.json { render json: @splunk_user.errors, status: :unprocessable_entity }
			end
		end
	end

	# DELETE /splunk_users/1
	# DELETE /splunk_users/1.json
	def destroy
		@splunk_user.destroy
		respond_to do |format|
			format.html { redirect_to splunk_users_url, notice: 'Splunk user was successfully destroyed.' }
			format.json { head :no_content }
		end
	end

	def test
		 @testuser=SplunkUser.new
		 @testuser.rpaas_user_name=params[:rpaas_user_name]
		 @testuser.memo=params[:memo]
		 @testuser.email=params[:email]
		 @env=params[:env]
	end

	def showscriptcontent
		begin
			Rails.logger.info "enters showscriptcontent function"
			user=SplunkUser.where(["create_user_id= ? and env= ?",current_authentication.create_user_id, params[:env]]).first
			input=InputLog.where(["id = ? and splunk_users_id = ?", params[:inputid], user.id]).first
			if input != nil
				send_data input.script, :type => 'text/txt',:disposition => 'inline'
			end
		rescue
			Rails.logger.info "rescues showscriptcontent function"
		ensure
			Rails.logger.info "compeletes showscriptcontent function"
		end
	end

	def setupinput
		begin
			Rails.logger.info "enters setupinput function"
			@env=params[:env]
			get_forwarders=Forwarder.new
			@forwarders=get_forwarders.get_all_forwarder_names_by_env(params[:env],current_authentication.create_user_id)
		rescue
			Rails.logger.info "rescues setupinput function"
		ensure
			Rails.logger.info "compeletes setupinput function"
		end
	end

	def setupinputconfirm
		 begin
				Rails.logger.info "enters setupinputconfirm function"
				data_retention=['1 Day','2 Day','3 Day','1 Week','2 Week','3 Week','1 Month','3 Month','6 Month','1 Year','3 Year','6 Year']
				log_size=['< 100 MB','< 500 MB','< 1000 MB','>1000 MB']
				@log_file_path=params[:log_file_path]
				@sourcetype=params[:sourcetype]
				@log_file_size=(params[:log_file_size].to_i)
				@data_retention_period=(params[:data_retention_period].to_i)
				@memo=params[:memo]
				@crcsalt=params[:crcsalt]
				@env=params[:env]
				Rails.logger.info "assigned values"
				get_forwarders=Forwarder.new
				@forwarders=get_forwarders.get_all_forwarder_names_by_env(params[:env],current_authentication.create_user_id)
		 rescue
				Rails.logger.info "rescues setupinputconfirm function"
		 ensure
				Rails.logger.info "completes setupinputconfirm function"
		 end
	end

	def useraccounts
		begin
			Rails.logger.info "enters the useraccounts function"
			all=SplunkUser.select("status,created_at,create_user_id,memo")
			all.each do |row|
				user_name=CreateUser.where(["id=?",row.create_user_id]).select("splunk_user_name").first
				row.memo=user_name.splunk_user_name
			end
			Rails.logger.info "fetched all accounts"
			render :json => all
			Rails.logger.info "returning required data in json format"
		rescue
			Rails.logger.info "rescues the useraccounts function"
		ensure
			Rails.logger.info "completes the useraccounts function"
		end
	end

	def userinputs  #called after add/edit/delete inputs
		begin
			Rails.logger.info "enters the userinputs function"
				users=SplunkUser.where(["create_user_id= ? and env= ?",current_authentication.create_user_id,params[:env]]).first
				all=InputLog.
				where(["splunk_users_id= ?",users.id]).
				select("id,status,splunk_users_id, log_file_path, created_at,sourcetype, script_name, os, app_id, memo").
				order(:log_file_path)

				all.each do | row |
					 user=current_authentication.splunk_user_name
					 if user!=[]
						testdate=row.created_at.to_s
						row.created_at=testdate[0,19]
						row.sourcetype = user

						row.memo = ""
						if row.app_id != nil
							app = App.where(["id=?",row.app_id]).select("name").first
							row.memo = app.name
						end
					 end
				end

				# app = App.select(:name).where(["id = ?", 8]).first
				all=all.to_json
				Rails.logger.info "fetched all inputs"
				render :json => all
				Rails.logger.info "returning required data in json format"
		rescue
			Rails.logger.info "rescues the userinputs function"
		ensure
			Rails.logger.info "completes the userinputs function"
		end
	end

	def setupinputpost
		begin
			Rails.logger.info "enters the setupinputpost function"
			result="starts"
			create_input_log=InputLog.new
			result=create_input_log.save_input_log(params[:log_file_path],params[:sourcetype],
				params[:log_file_size],params[:data_retention_period],params[:memo],
				current_authentication.create_user_id, params[:env], params[:blacklist_files], params[:crcsalt], params[:os], params[:interval], params[:scriptname], params[:script], params[:option], params[:type])
			if result=="fails"
				result="Something went wrong. Please try again or contact admins."
			elsif result=="starts"
				result="Database server is under maintenance. Please try again."
			else
				result="Added Input successfully!"
			end
		rescue
			flash[:notice]="Failed to add Input."
			result="fails"
			Rails.logger.info "rescues the setupinputpost function"
		ensure
			Rails.logger.info "completes the setupinputpost function"
		end
		render :text => result
	end

	def display
		begin
			Rails.logger.info "enters the display function"
			if (params[:user]==nil)
					@input=InputLog.where(["id = ?", params[:username]]).first
					@account_name=current_authentication.splunk_user_name
					@log_file_path=@input.log_file_path
					@sourcetype=@input.sourcetype
					@log_file_size=@input.log_file_size
					@data_retention_period=@input.data_retention_period
					@memo=@input.memo
					@crcsalt=@input.crcsalt
					#@blacklist = @input.blacklist
					@display="inputs"
			else
					@testuser=SplunkUser.where(["create_user_id = ?", current_authentication.create_user_id]).first
					@display="accounts"
			end
		rescue
			Rails.logger.info "rescues the display function"
		ensure
			Rails.logger.info "completes the display function"
		end
	end

	def setupinputvalidateuser
		proceed=""
		begin
			Rails.logger.info "enters the setupinputvalidateuser function"
			user=CreateUser.where(["splunk_user_name = ?", params[:user]]).first
			if user.splunk_user_name==nil
				 Rails.logger.info "does not exists"
			end
			proceed="yes"
		rescue
			#Rails.logger.info "rescues the setupinputvalidateuser function"
			proceed="no"
		ensure
			render :text => proceed
			Rails.logger.info "completes the setupinputvalidateuser function"
		end
	end

	def sendfeedback
		result=""
		begin
			Rails.logger.info "enters send feedback function"
			data={'username'=>params[:username],'subject'=>params[:subject],'content'=>params[:content]}
			SupportMail.sendfeedback_email(data).deliver
			get_user_email = CreateUser.new
			user_email = get_user_email.get_record_for("email","id",current_authentication.create_user_id)
			if( user_email.email != nil )
				SupportMail.send_feedback_acknowledgement_email( current_authentication.splunk_user_name, user_email.email ).deliver
			end
			result="completed"
		rescue
			Rails.logger.info "rescues feedback function"
			result="not completed"
		ensure
			Rails.logger.info "completes feedback function"
		end
		#render :json => result added empty template for this action
	end

	def listinputs
		begin
			Rails.logger.info "enters the listinputs function"
			@env=params[:env]
			@blacklists = [".tmp", ".gz", ".txt", ".bz2", ".conf", ".tar", ".rpm", ".tgz",".tar.gz"]
			@input_link = CONF['input_link']
			@unixapp_link = CONF['unixapp_link']
			@unixapp_dashboard_link = CONF['unixapp_dashboard_link']
			@about_link = CONF["about_link"]
			@faq_link = CONF["faq_link"]
			@reference_link = CONF["deploy_app_link"]
			@enable_size_cost_estimation_page = CONF["enable_size_cost_estimation_page"]
		rescue
			Rails.logger.info "rescues the listinputs function"
		ensure
			Rails.logger.info "completes the listinputs function"
		end
	end

	def getprofile
		begin
			Rails.logger.info "enters the getprofile function"
			@profile=CreateUser.where(["id= ?",current_authentication.create_user_id]).first
			result=@profile
		rescue
			result="no data"
			Rails.logger.info "rescues the getprofile function"
		ensure
			Rails.logger.info "completes the getprofile function"
		end
		render :json => result
	end

	def changePassword
		begin
			Rails.logger.info "enters the changePassword function"
			user=Authentication.new
			if params[:oldpassword]!=nil and params[:oldpassword]!=""
				result=user.changePassword(current_authentication.id,params[:oldpassword],params[:newpassword])
				if result=="success"
					 result="Password Changed successfully"
					 sign_in(current_authentication, :bypass => true)
				end
			else
				result="fails"
			end
			render :text => result
		rescue
			Rails.logger.info "rescues the changePassword function"
		ensure
			Rails.logger.info "completes the changePassword function"
		end
	end

	def getAccountStatus
		begin
			status=0
			Rails.logger.info "enters the getAccountStatus function"
			accounts=SplunkUser.new
			inputs=InputLog.new
			files=UserUploadedFiles.new
			result=accounts.check_if_exists(current_authentication.create_user_id,params[:env])
			if result!="no"
				status=100
				id=result
				result=inputs.check_if_exists(id)
				if result!="no"
					status=110
				end
				result=files.check_if_exists(id)
				if result!="no"
					status=111
				end
			end
			render :text => status
		rescue
			Rails.logger.info "rescues the getAccountStatus function"
		ensure
			Rails.logger.info "completes the getAccountStatus function"
		end
	end

	def getEnvironmentProfile
		begin
			Rails.logger.info "enters the getEnvironmentProfile function"
			@user=SplunkUser.where(["create_user_id=? and env=?",current_authentication.create_user_id,params[:env]]).select("rpaas_user_name,status,splunk_host_id,env").first
			splunk_host=SplunkHosts.select(:name).where(["id=?",@user.splunk_host_id]).first
			@user.env=splunk_host.name
			#render :json => @user
		rescue
			result="no account yet"
			Rails.logger.info "cannot get EnvironmentProfile details"
		ensure
			Rails.logger.info "completes the getEnvironmentProfile function"
		end
		render :json => @user
	end


	def updateEmailAddress
		begin
			Rails.logger.info "enters the updateEmailAddress function"
			update_user = CreateUser.new
			result = update_user.update_profile(current_authentication.create_user_id, params[:appteamname], params[:groupname], params[:serviceid], params[:email], params[:email_emergency])
		rescue
			result="fails"
			Rails.logger.info "rescues the updateEmailAddress function"
		ensure
			Rails.logger.info "completes the updateEmailAddress function"
		end
		render :text => result
	end

	def get_announcements
		begin
			Rails.logger.info "enters the get_announcements function"
			result="started"
			announcements=Announcements.new
			result=announcements.get_announcements("users")
		rescue
			result="failed"
			Rails.logger.info "rescues the get_announcements function"
		ensure
			Rails.logger.info "completes the get_announcements function"
		end
		render :json => result
	end

	def get_announcements_count
		begin
			Rails.logger.info "enters the get_announcements_count function"
			result="started"
			announcements=Announcements.new
			result=announcements.get_announcements_count("users")
		rescue
			result="failed"
			Rails.logger.info "rescues the get_announcements_count function"
		ensure
			Rails.logger.info "completes the get_announcements_count function"
		end
		render :json => result
	end

	def manage_forwarders
		begin
			Rails.logger.info "enters the manage_forwarders function"
			result="started"
			@env=params[:env]
			@about_link = CONF["about_link"]
			@faq_link = CONF["faq_link"]
			@reference_link = CONF["deploy_app_link"]
			@enable_size_cost_estimation_page = CONF["enable_size_cost_estimation_page"]
		rescue
			result="failed"
			Rails.logger.info "rescues the manage_forwarders function"
		ensure
			Rails.logger.info "completes the manage_forwarders function"
		end
	end


	def get_forwarders
		begin
			Rails.logger.info "enters the get_forwarders function"
			result="started"
			get_forwarders=Forwarder.new
			forwarders=get_forwarders.get_all_records_by_env(params[:env],current_authentication.create_user_id)
			result=forwarders
		rescue
			result="failed"
			Rails.logger.info "rescues the get_forwarders function"
		ensure
			Rails.logger.info "completes the get_forwarders function"
		end
		render :json => result
	end


	def add_forwarder
		begin
			Rails.logger.info "enters the add_forwarder function"
			result="started"
			add_forwarder=Forwarder.new
			result=add_forwarder.add_record(params[:forwarder_name],params[:env],current_authentication.create_user_id)
			if result=="success"
				result="Forwarder was added successfully."
			elsif result=="starts"
				result="Database Server is under Maintenance.Please Try Again Later."
			elsif results=="failed"
				result="Server is under Maintenance.Please Contact Admins."
			end
		rescue
			result="failed"
			Rails.logger.info "rescues the add_forwarder function"
		ensure
			Rails.logger.info "completes the add_forwarder function"
		end
		render :text => result
	end


	def edit_forwarder
		begin
			Rails.logger.info "enters the edit_forwarder function"
			result="started"
			edit_forwarder=Forwarder.new
			result=edit_forwarder.edit_record(params[:forwarder_name],params[:forwarder])
			if result=="success"
				result="Forwarder was updated successfully."
			elsif result=="starts"
				result="Database Server is under Maintenance.Please Try Again Later."
			elsif results=="failed"
				result="Server is under Maintenance.Please Contact Admins."
			end
		rescue
			result="failed"
			Rails.logger.info "rescues the edit_forwarder function"
		ensure
			Rails.logger.info "completes the edit_forwarder function"
		end
		render :text => result
	end


	def delete_forwarder
		begin
			Rails.logger.info "enters the delete_forwarder function"
			result="started"
			delete_forwarder=Forwarder.new
			is_associated = Forwarder.new
			associated_server_classes = is_associated.has_associated_server_class(params[:forwarder])
			if associated_server_classes == 0
				result=delete_forwarder.delete_record(params[:forwarder])
				if result=="success"
					result = 1
				elsif result=="starts"
					result = 2
				elsif results=="failed"
					result = 0
				end
			else
				result = -1
			end
		rescue
			result="failed"
			Rails.logger.info "rescues the delete_forwarder function"
		ensure
			Rails.logger.info "completes the delete_forwarder function"
		end
		render :text => result
	end



	def get_forwarders_count
		begin
			Rails.logger.info "enters the get_forwarders_count function"
			result="started"
			get_forwarders=Forwarder.new
			count=get_forwarders.get_forwarders_count(params[:env],current_authentication.create_user_id)
			result=count
		rescue
			result="failed"
			Rails.logger.info "rescues the get_forwarders_count function"
		ensure
			Rails.logger.info "completes the get_forwarders_count function"
		end
		render :json => result
	end


	def list_forwarders
		begin
			Rails.logger.info "enters the list_forwarders function"
			result="started"
			list_forwarders=Forwarder.new
			if params[:request_by]!=nil
				get_user_id=SplunkUser.new
				get_splunk_user_id=InputLog.new
				splunk_user_id=get_splunk_user_id.get_record_for("splunk_users_id","id",params[:input])
				user_id=get_user_id.get_record_for("create_user_id","id",splunk_user_id.splunk_users_id)
				forwarders=list_forwarders.get_records_for("name","create_user_id",user_id.create_user_id)
			else
				forwarders=list_forwarders.get_all_forwarder_names_by_env(params[:env],current_authentication.create_user_id)
			end
			result=forwarders
		rescue
			result="failed"
			Rails.logger.info "rescues the list_forwarders function"
		ensure
			Rails.logger.info "completes the list_forwarders function"
		end
		render :json => result
	end


	def delete_inputs
		begin
			Rails.logger.info "enters the delete_inputs function"
			result="started"
			delete_input_log=InputLog.new
			is_associated = InputLog.new
			associated_apps = is_associated.has_associated_app(params[:log])
			if associated_apps == 0
				result=delete_input_log.delete_record(params[:log])
				if result=="success"
					result="Deleted Input successfully!"
				elsif result=="starts"
					result="Database Server is under maintenance. Please try again later."
				elsif results=="failed"
					result="Server is under maintenance. Please contact Admins."
				end
			else
				result = "This Input is linked to an App. Please update the app before deleting the input."
			end
		rescue
			result="fails"
			Rails.logger.info "rescues the delete_inputs function"
		ensure
			Rails.logger.info "completes the delete_inputs function"
		end
		render :text => result
	end


	def edit_inputs
		begin
			Rails.logger.info "enters the edit_inputs function"
			result="started"
			edit_input_log=InputLog.new
			result=edit_input_log.edit_record(params[:log],params[:log_file_path],params[:sourcetype],params[:log_file_size],params[:data_retention_period],params[:memo],current_authentication.create_user_id,params[:env],params[:blacklist_files], params[:crcsalt], params[:os], params[:interval], params[:scriptname], params[:script], params[:option], params[:type])
			if result=="success"
				result="Successful!"
			elsif result=="starts"
				result="Database Server is under Maintenance.Please Try Again Later."
			elsif results=="failed"
				result="Server is under Maintenance.Please Contact Admins."
			end
		rescue
			result="fails"
			Rails.logger.info "rescues the edit_inputs function"
		ensure
			Rails.logger.info "completes the edit_inputs function"
		end
		render :text => result
	end

	def fetch_single_inputs
		begin
			Rails.logger.info "enters fetch_single_inputs function"
			result="starts"
			fetch_single_inputs=InputLog.new
			single_inputs=fetch_single_inputs.get_record(params[:log])
			if single_inputs=="fails"
				result="Something Went Wrong.Please Try Again or Contact Admins."
			elsif single_inputs=="starts"
				result="Database Server is under maintenance.Please Try Again."
			else
				# if single_inputs.script != nil
				#   single_inputs.script.force_encoding('UTF-8') //for japanese char
				# end
				result=single_inputs
			end
		rescue
			result="fails"
			Rails.logger.info "rescues fetch_single_inputs function"
		ensure
			Rails.logger.info "completes fetch_single_inputs function"
		end
		render :json => result
	end

	def add_server_class
		begin
			result="starts"
			Rails.logger.info "enters add_server_class function"
			add_server_class = ServerClass.new
			result=add_server_class.add_record(current_authentication.create_user_id, params[:class_name], params[:regex], params[:env], params[:forwarders])
			if result=="starts"
				result="The Database Server Seems to be under Maintenance, Please try Again Later!!!"
			elsif result=="fails"
				result="Something went Wrong, Please contact the Admins."
			elsif result=="success"
				result="Successful!"
			end
		rescue
			result="fails"
			Rails.logger.info "rescues add_server_class function"
		ensure
			Rails.logger.info "completes add_server_class function"
		end
		render :text => result
	end

	def get_server_classes
		begin
			Rails.logger.info "enters get_server_classes function"
			result = "starts"
			get_server_classes = ServerClass.new
			classes = get_server_classes.get_all_records_of_user_for(current_authentication.create_user_id,"env",params[:env])
			result = classes
		rescue
			result="fails"
			Rails.logger.info "rescues get_server_classes function"
		ensure
			Rails.logger.info "completes get_server_classes function"
		end
		render :json => result
	end


	def list_forwarders_from_deployment_server
		begin
			Rails.logger.info "enters the list_forwarders_from_deployment_server function"
			result="starts"
			list_forwarders=Forwarder.new
			forwarders=list_forwarders.get_forwarders_from_deployment_server(params[:env])
			existing_forwarders = list_forwarders.get_all_records_by_env(params[:env],current_authentication.create_user_id)
			existing_forwarders.each do |existing_forwarder|
				if forwarders.include?(existing_forwarder.name)
					 forwarders.delete(existing_forwarder.name)
				end
			end
			forwarders.sort!
			result=forwarders
		rescue
			result="fails"
			Rails.logger.info "rescues the list_forwarders_from_deployment_server function"
		ensure
			Rails.logger.info "completes the list_forwarders_from_deployment_server function"
		end
		render :json => result
	end


	def add_forwarder_from_deployment_server
		begin
			Rails.logger.info "enters the add_forwarder_from_deployment_server function"
			result="starts"
			forwarders=Array.new
			env=params[:env]
			user_id=current_authentication.create_user_id
			add_forwarder=Forwarder.new
			forwarders=params[:forwarders].split("|")
			forwarders.each do |forwarder|
				add_forwarder.add_record(forwarder,env,user_id)
			end
			result="Added forwarder successfully"
		rescue
			result="fails"
			Rails.logger.info "rescues the add_forwarder_from_deployment_server function"
		ensure
			Rails.logger.info "completes the add_forwarder_from_deployment_server function"
		end
		render :text => result
	end

	def get_server_class_forwarders
		begin
			Rails.logger.info "enters get_server_class_forwarders"
			result="starts"
			get_forwarders = ServerClass.new
			forwarders=get_forwarders.get_forwarders(current_authentication.create_user_id,params[:env],params[:server_class])
			forwarders  = forwarders.concat(["regex"])
			regex = get_forwarders.get_record_for("regex","id",params[:server_class])
			forwarders = forwarders.concat([regex.regex])
			result=forwarders
		rescue
			result="fails"
			Rails.logger.info "rescues get_server_class_forwarders"
		ensure
			Rails.logger.info "completes get_server_class_forwarders"
		end
		render :json => result
	end

	def get_server_class_clients
		begin
			Rails.logger.info "enters get_server_class_clients function"
			result="starts"
			list_clients=Forwarder.new
			potential_clients=Array.new
			new_clients = Array.new
			get_old_clients = ServerClassForwarder.new
			get_regex = ServerClass.new
			existing_clients=get_old_clients.get_user_clients(params[:server_class],current_authentication.create_user_id)      
			clients=list_clients.get_all_forwarder_names_by_env(params[:env],current_authentication.create_user_id)
			clients.each do |client|
				if !(existing_clients.include?(client))
					 new_clients.push(client)
					 #clients.delete(client)
				end
			end
			potential_clients = existing_clients.concat(["ends"])
			potential_clients = potential_clients.concat(new_clients)
			potential_clients = potential_clients.concat(["regex"])
			regex = get_regex.get_record_for("regex","id",params[:server_class])
			potential_clients = potential_clients.concat([regex.regex])
			result=potential_clients
		rescue
			result="fails"
			Rails.logger.info "rescues get_server_class_clients function"
		ensure
			Rails.logger.info "completes get_server_class_clients function"
		end
		render :json => result
	end

	def edit_server_class
		begin
			Rails.logger.info "enters edit_server_class function"
			result="starts"
			is_associated = ServerClass.new
			associated_apps = is_associated.has_associated_app(params[:server_class])
			delete_old_record = ServerClassForwarder.new
			add_ref_to_forwarder= ServerClassForwarder.new
			update_server_class = ServerClass.new
			result = update_server_class.update_server_class(params[:server_class],params[:server_class_name],params[:server_class_regex])
			forwarders = params[:forwarders].split("|")
			result = delete_old_record.delete_records_for("server_class_id",params[:server_class])
			forwarders.each do |forwarder|
				id=Forwarder.select("id").where(["name = ? and create_user_id = ?",forwarder, current_authentication.create_user_id]).first
				add_ref_to_forwarder.add_record(params[:server_class], id.id)
			end
			if associated_apps > 0
				get_user_email = CreateUser.new
				user_email = get_user_email.get_record_for("email","id", current_authentication.create_user_id)
				SupportMail.deploy_setting_re_apply_request("forwarder", user_email.email, current_authentication.splunk_user_name, params[:env]).deliver
				result = "Updated Server Class successfully! Please apply your app to include new Server Class changes!"
			else
				result = "Updated Server Class successfully!"
			end
		rescue
			result="fails"
			Rails.logger.info "rescues edit_server_class function"
		ensure
			Rails.logger.info "completes edit_server_class function"
		end
		render :text => result
	end

	def delete_server_class
		begin
			Rails.logger.info "enters delete_server_class function"
			result= "starts"
			delete_server_class = ServerClass.new
			is_associated = ServerClass.new
			delete_server_class = ServerClass.new
			associated_apps = is_associated.has_associated_app(params[:server_class])
			result = delete_server_class.delete_record(params[:server_class])
			if result == "success"
				if associated_apps > 0
					get_user_email = CreateUser.new
					user_email = get_user_email.get_record_for("email","id", current_authentication.create_user_id)
					SupportMail.deploy_setting_re_apply_request("delete server class", user_email.email, current_authentication.splunk_user_name, params[:env]).deliver
					result = "Deleted Server Class successfully! Please Re-apply to reflect changes!!"
				else
					result = "Deleted Server Class successfully!"
				end
			else
				result = "Something went wrong, please try again later. "
			end
		rescue
			result= "fails"
			Rails.logger.info "rescues delete_server_class function"
		ensure
			Rails.logger.info "completes delete_server_class function"
		end
		render :text => result
	end


	def add_app
		begin
			Rails.logger.info "enters add_app function"
			result="starts"
			add_app = App.new
			result=add_app.add_record(current_authentication.create_user_id,params[:app_name],params[:env],params[:inputs],params[:unixapp])
			if result=="starts"
				result="The Database Server seems to be under maintenance, please try again later!!!"
			elsif result=="fails"
				result="Something went wrong, please contact the Admins."
			elsif result=="success"
				result="Added App successfully!!!"
			end
		rescue
			result="fails"
			Rails.logger.info "rescues add_app function"
		ensure
			Rails.logger.info "completes add_app function"
		end
		render :text => result
	end

	def get_apps
		begin
			Rails.logger.info "enters get_apps function"
			result = "starts"
			get_apps = App.new
			apps = get_apps.get_all_records_by_env(current_authentication.create_user_id, params[:env])
			result = apps
		rescue
			result = "fails"
			Rails.logger.info "rescues get_apps function"
		ensure
			Rails.logger.info "completes get_apps function"
		end
		render :json => result
	end

	def get_inputs
		begin
			Rails.logger.info "enters get_inputs function"
			result = "starts"
			get_inputs = InputLog.new
			inputs = get_inputs.get_all_records_for_apps(current_authentication.create_user_id, params[:env])

			result = inputs
		rescue
			resilt = "fails"
			Rails.logger.info "rescues get_inputs function"
		ensure
			Rails.logger.info "completes get_inputs function"
		end
		render :json => result
	end


	def get_app_inputs
		begin
			Rails.logger.info "enters get_app_inputs function"
			result = "starts"
			get_app = InputLog.new
			app = get_app.get_records_for_app(current_authentication.create_user_id, params[:app], params[:env])
			all_apps = get_app.get_all_records_for_apps(current_authentication.create_user_id, params[:env])
			all_apps.each do |apps|
				if app.include?(apps)
					 all_apps.delete(apps)
				end
			end
			app = app.concat(["ends"])
			app = app.concat(all_apps)
			result = app
		rescue
			result = "fails"
			Rails.logger.info "rescues get_app_inputs function"
		ensure
			Rails.logger.info "completes get_app_inputs function"
		end
		render :json => result
	end


	def edit_app
		begin
			Rails.logger.info "enters edit_app function"
			result="starts"
			is_associated = InputLog.new
			associated_apps = is_associated.has_associated_input_log(params[:app])
			edit_app = App.new
			result=edit_app.edit_record(current_authentication.create_user_id,params[:app],params[:app_name],params[:env],params[:inputs])
			if result=="starts"
				result="The Database server seems to be under maintenance, Please try again later!!"
			elsif result=="fails"
				result="Something went wrong, Please contact the Admins."
			elsif result=="success"
				if associated_apps > 0
				get_user_email = CreateUser.new
				user_email = get_user_email.get_record_for("email","id", current_authentication.create_user_id)
				SupportMail.deploy_setting_re_apply_request("app", user_email.email, current_authentication.splunk_user_name, params[:env]).deliver
					result="Successful! Please send request again in Deploy Apps."
				else
					result="The App was edited successfully!"
				end
			end
		rescue
			result="fails"
			Rails.logger.info "rescues edit_app function"
		ensure
			Rails.logger.info "completes edit_app function"
		end
		render :text => result
	end


	def get_app
		begin
			Rails.logger.info "enters get_app function"
			result = "starts"
			get_app = InputLog.new
			app = get_app.get_records_for_app(current_authentication.create_user_id, params[:app], params[:env])
			result = app
		rescue
			result = "fails"
			Rails.logger.info "rescues get_app function"
		ensure
			Rails.logger.info "completes get_app function"
		end
		render :json => result
	end

	def add_deploy_setting
		begin
			Rails.logger.info "enters add_deploy_setting function"
			result = "starts"
			update_deploy_setting = DeploySetting.new
			result = update_deploy_setting.deploy_setting(params[:app],params[:server_classes])
		rescue
			result = "fails"
			Rails.logger.info "rescues add_deploy_setting function"
		ensure
			Rails.logger.info "completes add_deploy_setting function"
		end
		render :text => result
	end

	#deploy config
	def get_app_server_classes
		begin
			Rails.logger.info "enters get_app_server_classes function"
			result = "starts"
			get_app_server_classes = DeploySetting.new
			server_classes = get_app_server_classes.get_deploy_setting(current_authentication.create_user_id,params[:app],params[:env])
			result = server_classes

			get_app = InputLog.new
			app = get_app.get_records_for_app(current_authentication.create_user_id, params[:app], params[:env])

			ids = Array.new
			result.each {|serverclass| 
				if serverclass == "ends" then
					next
				end
				ids << serverclass.attributes["id"]
			}

			get_forwarders = ServerClass.new
			all_forwarders = Array.new

			ids.each {|id|
				Rails.logger.info "[get_app_server_classes: #{id}"
				forwarders=get_forwarders.get_forwarders(current_authentication.create_user_id,params[:env],id)
				forwarders  = forwarders.concat(["regex"])
				regex = get_forwarders.get_record_for("regex","id",id)
				forwarders = forwarders.concat([regex.regex])
				Rails.logger.info "[get_app_server_classes: #{forwarders}"
				all_forwarders << forwarders
			}

		rescue
			result = "fails"
			Rails.logger.info "rescues get_app_server_classes function"
		ensure
			Rails.logger.info "completes get_app_server_classes function"
		end
		#render :json => result
		respond_to do |format|
		format.json  { render :json => {:inputs => app, :serverclasses => result, :forwarders => all_forwarders }}
		end
	end

	def delete_app
		begin
			Rails.logger.info "enters delete_app function"
			result = "starts"
			delete_app = App.new
			result = delete_app.delete_record(params[:app])
		rescue
			result = "fails"
			Rails.logger.info "rescues delete_app function"
		ensure
			Rails.logger.info "completes delete_app function"
		end
		render :text => result
	end

	def manage_deploy_requests
		begin
			Rails.logger.info "enters manage_deploy_requests function"
			@env=params[:env]
			@about_link = CONF["about_link"]
			@faq_link = CONF["faq_link"]
			@reference_link = CONF["deploy_app_link"]
			@enable_size_cost_estimation_page = CONF["enable_size_cost_estimation_page"]
		rescue
			Rails.logger.info "rescues manage_deploy_requests function"
		ensure
			Rails.logger.info "completes manage_deploy_requests function"
		end
	end

	def request_deploy_settings
		begin 
			Rails.logger.info "enters request_deploy_settings funtion"
			result = "starts"
			send_request = DeploySetting.new
			result = send_request.request_app_deploy_settings(current_authentication.create_user_id, params[:app], params[:env], current_authentication.splunk_user_name);
		rescue
			result = "fails"
			Rails.logger.info "rescues request_deploy_settings funtion"
		ensure
			Rails.logger.info "completes request_deploy_settings funtion"
		end
		render :text => result
	end

	def validate_request_deploy_settings
		begin 
			Rails.logger.info "enters validate_request_deploy_settings funtion"
			result = "starts"
			send_request = DeploySetting.new
			validate_status = send_request.validate_request_app_deploy_settings(params[:app])
			if validate_status > 0
				result = 1
			else
				result = 0
			end
		rescue
			result = -1
			Rails.logger.info "rescues validate_request_deploy_settings funtion"
		ensure
			Rails.logger.info "completes validate_request_deploy_settings funtion"
		end
		render :text => result
	end


	def request_stop_forwarding
		begin 
			Rails.logger.info "enters request_stop_forwarding funtion"
			result = "starts"
			send_request = DeploySetting.new
			result = send_request.request_stop_forwarding(current_authentication.splunk_user_name, params[:app],  current_authentication.create_user_id);
			if result =="success"
				result = "No Data will be forwarder from this APP NOW. Send REQUEST Again if you wish to start Forwarding Data."
			else
				result = "Something Went Wrong. Please Contact our Admins By FeedBack or Email."
			end
		rescue
			result = "fails"
			Rails.logger.info "rescues request_stop_forwarding funtion"
		ensure
			Rails.logger.info "completes request_stop_forwarding funtion"
		end
		render :text => result
	end

	def get_size_and_storage
		begin
			Rails.logger.info "enters get_size_and_storage funtion"

			price=Price.new
		  	prc=price.get_price
		  	puts prc
		  	if prc == nil
			  	@service_unit_price = 0
			  	@storage_unit_price = 0
			else
				@service_unit_price = prc.service_unit_price
				@storage_unit_price = prc.storage_unit_price
		  	end
		  	
			@enable_size_cost_estimation_page = CONF["enable_size_cost_estimation_page"]
			@env=params[:env]
      		if !@enable_size_cost_estimation_page
      			redirect_to "/splunk_users?env=" + @env
      		end
			@month_ranges = Array.new
			time = Time.new
			for i in 2016..time.year do
				if i != time.year then
					for j in 1..12 do
						if i == 2016 && j < 5 then
							next
						end
						@month_ranges.push(i.to_s + "-" + j.to_s.rjust(2, '0'))
					end
				else
					for j in 1..time.month do
						if i == 2016 && j < 5 then
							next
						end
						if j != time.month || time.day > 15 then
							@month_ranges.push(i.to_s + "-" + j.to_s.rjust(2, '0'))
						end
					end
				end
			end

			result = "starts"
		rescue
			Rails.logger.info "rescues get_size_and_storage funtion"
		ensure
			Rails.logger.info "completes get_size_and_storage funtion"
		end
	end

	def get_log_size()
		begin
			Rails.logger.info "enters splunk_users_controller.get_log_size funtion"
			@env=params[:env]
			result = "starts"
			input_log = InputLog.new
			user=CreateUser.select(:serviceid).where(["id= ?",current_authentication.create_user_id]).first
			host=SplunkHosts.select(:name).where(["role=? and env=?", "MASTER", @env])
			hostname = ""
			host.each do |ht|
				hostname = ht.name.to_json #cannot use ht.name.to_json directly (output is SplunkHosts)
			end
			hostname = hostname[1...-1] #remove " and "
			result = input_log.get_log_size(params[:env], params[:month], hostname, user.serviceid.to_json)
		rescue
			Rails.logger.info "rescues splunk_users_controller.get_log_size funtion"
		ensure
			Rails.logger.info "completes splunk_users_controller.get_log_size funtion"
		end
		render :json => result
	end

	def get_log_storage()
		begin
			Rails.logger.info "enters splunk_users_controller.get_log_storage funtion"
			@env=params[:env]
			result = "starts"
			input_log = InputLog.new
			user=CreateUser.select(:serviceid).where(["id= ?",current_authentication.create_user_id]).first
			host=SplunkHosts.select(:name).where(["role=? and env=?", "MASTER", @env])
			hostname = ""
			host.each do |ht|
				hostname = ht.name.to_json #cannot use ht.name.to_json directly (output is SplunkHosts)
			end
			hostname = hostname[1...-1] #remove " and "
			result = input_log.get_log_storage(params[:env], params[:month], hostname, user.serviceid.to_json)
		rescue
			Rails.logger.info "rescues splunk_users_controller.get_log_storage funtion"
		ensure
			Rails.logger.info "completes splunk_users_controller.get_log_storage funtion"
		end
		render :json => result
	end

	def get_unit_prices()
		begin
		  Rails.logger.info "splunk user enters get_unit_prices function"
		  price=Price.new
		  prices=price.get_prices
		rescue
		  Rails.logger.info "rescues splunk user get_unit_prices function"
		ensure
		  Rails.logger.info "completes splunk user get_unit_prices function"
		end
		render :json => prices
	end
 #def after_sign_in_path_for(resource)
	#  "/"
	#end

	private
		# Use callbacks to share common setup or constraints between actions.
		def set_splunk_user
			@splunk_user = SplunkUser.find(params[:id])
		end

		# Never trust parameters from the scary internet, only allow the white list through.
		def splunk_user_params
			params.require(:splunk_user).permit(:user_name, :group_name, :app_team_name, :serviceid, :rpaas_user_flg, :memo)
		end

		def test_user_params
			params(:user_name, :group_name, :app_team_name, :serviceid, :rpaas_user_flg, :memo)
		end

		def must_be_post
			 unless request.method == "POST"
				 redirect_to '/'
			 end
		end

		def has_splunk_account
			begin
				Rails.logger.info "enters has splunk_account function"
				has_splunk_account = SplunkUser.new
				result = has_splunk_account.is_a_splunk_user(current_authentication.create_user_id, params[:env])
				if result == 0
					redirect_to :controller => 'splunk_users', :action => 'index', :env => params[:env]
				end
			rescue
				Rails.logger.info "ensures has splunk_account function"
			ensure
				Rails.logger.info "completes has splunk_account function"
			end
		end

end
