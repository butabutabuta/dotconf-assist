require 'logger'
Rails.logger = Logger.new(Rails.root.join("log","admin_controller.log"))
Rails.logger.level = 1


class AdminController < ApplicationController
  POST_ONLY_ACTIONS = [:report]
  protect_from_forgery except: :report
  http_basic_authenticate_with name: CONF["dotconf_assist_admin_user_name"], password: CONF["dotconf_assist_admin_password"],  except: :requestaccount
  before_filter :must_be_post, :only => POST_ONLY_ACTIONS
  def home
  end

  def accountlist
  end

  def inputlist
  end

  def generateconf
  end

  def report
    begin
      Rails.logger.info "enters the report function"
      if (params[:user]==nil)
          @input=InputLog.where(["id=?", params[:username]]).first
          user=SplunkUser.where(["id = ?", @input.splunk_users_id]).select("create_user_id").first
          user_name=CreateUser.where(["id=?",user.create_user_id]).select("splunk_user_name").first
          @account_name=user_name.splunk_user_name
          @log_file_path=@input.log_file_path
          @sourcetype=@input.sourcetype
          @log_file_size=@input.log_file_size
          @data_retention_period=@input.data_retention_period
          @memo=@input.memo
          @crcsalt=@input.crcsalt
          @status=@input.status
          @display="inputs"
      else
          get_splunk_user_data=SplunkUser.new
          splunk_user_data=get_splunk_user_data.get_record(params[:user])
          get_create_user_data=CreateUser.new
          @testuser=get_create_user_data.get_record(splunk_user_data.create_user_id)
          @status=splunk_user_data.status
          @id=splunk_user_data.id
          @display="accounts"
      end
    rescue
      Rails.logger.info "rescues the report function"
    ensure
      Rails.logger.info "completes the report function"
    end
  end

  def useraccounts
    begin
      Rails.logger.info "enters the useraccounts function"
      all=SplunkUser.select("id,status,user_name,created_at")
      Rails.logger.info "fetched all accounts"
      render :json => all
      Rails.logger.info "returning required data in json format"
    rescue
      Rails.logger.info "rescues the useraccounts function"
    ensure
      Rails.logger.info "completes the useraccounts function"
    end
  end

  def userinputs
    begin
      Rails.logger.info "enters the userinputs function"
      all=InputLog.select("id,status,splunk_users_id,log_file_path,created_at,sourcetype")
      all.each do | row |
         user=SplunkUser.where(["id = ?", row.splunk_users_id]).select("user_name")
         row.sourcetype = user[0].user_name
      end
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

  def generateconf
    begin
      Rails.logger.info "enters the generateconf function"
      @input=InputLog.where(["id = ?", params[:id]]).first
      Rails.logger.info "fetched input"
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
      @conf="[monitor://#{@input.log_file_path}]<br>disabled=false<br>sourcetype=#{@input.sourcetype}<br>index=idx_common_#{data_period}<br>ignoreOlderThan=10d<br>"
      send_data @conf, :filename => 'inputs.conf.txt'
    rescue
      Rails.logger.info "rescues the generateconf function"
    ensure
      Rails.logger.info "completes the generateconf function"
    end
  end

  def cancelinputs
    begin
      Rails.logger.info "enters the cancelinputs function"
      @input=InputLog.where(["id = ?", params[:id]]).first
      @input.status=9
      @input.save
      render :text => "canceled"
    rescue
      Rails.logger.info "rescues the cancelinputs function"
    ensure
      Rails.logger.info "completes the cancelinputs function"
    end
  end

  def approveinputs
    begin
      Rails.logger.info "enters the approveinputs function"
      approve_input = InputLog.new
      result = approve_input.approve_input(params[:id])
      render :text => "approved"
    rescue
      Rails.logger.info "rescues the approveinputs function"
    ensure
      Rails.logger.info "completes the approveinputs function"
    end
  end

  def cancelaccounts
    begin
      Rails.logger.info "enters the cancelaccounts function"
      @input=SplunkUser.where(["id = ?", params[:id]]).first
      @input.status=9
      @input.save
      SupportMail.requestcancelinformadmin_email(@input).deliver
      if(@input.email)!=""
         SupportMail.requestcancel_email(@input).deliver
      end
      render :text => "canceled"
    rescue
      Rails.logger.info "rescues the cancelaccounts function"
    ensure
      Rails.logger.info "completes the cancelaccounts function"
    end
  end

  def approveaccounts
    begin
      Rails.logger.info "enters the approveaccounts function"
      @user=SplunkUser.new
      @user.approveuser(params[:id])
      render :text => "approved"
    rescue
      Rails.logger.info "rescues the approveaccounts function"
    ensure
      Rails.logger.info "completes the approveaccounts function"
    end
  end

  def requestaccount
    begin
      Rails.logger.info "enters requestaccount function"
      user=CreateUser.new
      result=user.request_account(params[:splunk_user_name],params[:email],params[:email_emergency],params[:app_team_name],params[:group_name],params[:serviceid],params[:password])
      if result=="failed"
        flash[:notice]="Database Server is under Maintenance.Please Try again Later."
      else
        flash[:notice]="Your Request is forwarded to our Admins. Please Check Email if you had provided one."
      end
      redirect_to "/"
    rescue
      Rails.logger.info "rescues requestaccount function"
    ensure
      Rails.logger.info "completes requestaccount function"
    end
  end

  def list_request_accounts
    begin
      Rails.logger.info "enters list_request_accounts function"
      get_request_accounts=CreateUser.new
      request_accounts=get_request_accounts.get_all_records
      render :json => request_accounts
      Rails.logger.info "returning required data in json format"
    rescue
      Rails.logger.info "rescues list_request_accounts function"
    ensure
      Rails.logger.info "completes list_request_accounts function"
    end
  end

  def approve_request_accounts
    begin
      Rails.logger.info "enters approve_request_accounts function"
      approve_user=CreateUser.new
      result=approve_user.approve_account_request(params[:user])
    rescue
      Rails.logger.info "rescues approve_request_accounts function"
    ensure
      Rails.logger.info "completes approve_request_accounts function"
    end
  end

  def cancel_request_accounts
    begin
      Rails.logger.info "enters cancel_request_accounts function"
      cancel_user=CreateUser.new
      result=cancel_user.cancel_account_request(params[:user])
    rescue
      Rails.logger.info "rescues cancel_request_accounts function"
    ensure
      Rails.logger.info "completes cancel_request_accounts function"
    end
  end

  def display_request_account
    begin
      Rails.logger.info "enters display_request_account function"
      @user=CreateUser.where(["id = ?",params[:id]]).first
    rescue
      Rails.logger.info "rescues display_request_account function"
    ensure
      Rails.logger.info "completes display_request_account function"
    end
  end

  def showscriptcontent
    begin
      Rails.logger.info "enters admin showscriptcontent function"
        input=InputLog.where(["id = ?", params[:inputid]]).first
        if input != nil
        send_data input.script, :type => 'text/txt',:disposition => 'inline'
        end
    rescue
      Rails.logger.info "rescues admin showscriptcontent function"
    ensure
      Rails.logger.info "compeletes admin showscriptcontent function"
    end
  end

  def getInputs
    begin
      Rails.logger.info "enter getInputs function"
      inputs=InputLog.select("id,status,splunk_users_id,log_file_path,created_at,memo,script_name,os")
      inputs.each do |input|
        user_name=SplunkUser.where(["id=?",input.splunk_users_id]).select("create_user_id").first
        user_name=CreateUser.where(["id=?",user_name.create_user_id]).select("splunk_user_name").first
        input.memo=user_name.splunk_user_name
      end
      render :json => inputs
    rescue
      Rails.logger.info "rescues getInputs function"
    ensure
      Rails.logger.info "completes getInputs function"
    end
  end

  def get_splunk_accounts
    begin
      Rails.logger.info "enters get_splunk_accounts function"
      @splunkusers=SplunkUser.all
      @splunkusers.each do |splunk|
        user=CreateUser.where(["id=?",splunk.create_user_id]).first
        splunk.rpaas_user_name=user.splunk_user_name
      end
      render :json => @splunkusers
    rescue
      Rails.logger.info "rescues get_splunk_accounts function"
    ensure
      Rails.logger.info "completes get_splunk_accounts function"
    end
  end

  def manage_prices
    begin
      Rails.logger.info "enters manage_prices function"
    rescue
      Rails.logger.info "rescues manage_prices function"
    ensure
      Rails.logger.info "completes manage_prices function"
    end
  end

  def add_price
    begin
      Rails.logger.info "enters add_price function"
      price=Price.new
      result=price.add_price(params[:service_unit_price],params[:storage_unit_price])
      if result=="starts"
        result="Database Server is under Maintenance"
      elsif result=="success"
        result="Price was added Successfully"
      elsif result=="failed"
        result="Something went wrong, Please Try again or contact Support Team"
      end
    rescue
      Rails.logger.info "rescues add_price function"
    ensure
      Rails.logger.info "completes add_price function"
    end
    render :text => result
  end

  def show_prices
    begin
      Rails.logger.info "enters show_prices function"
      price=Price.new
      prices=price.get_prices
      render :json => prices
    rescue
      Rails.logger.info "rescues show_prices function"
    ensure
      Rails.logger.info "completes show_prices function"
    end
  end

  def edit_price
    begin
      Rails.logger.info "enters edit_price function"
      new_price=Price.new
      result=new_price.update_price(params[:price_id],params[:service_unit_price],params[:storage_unit_price])
      if result=="starts"
        result="Database Server is under Maintenance"
      elsif result=="success"
        result="Price was updated Successfully"
      elsif result=="failed"
        result="Something went wrong, Please Try again or contact Support Team"
      end
    rescue
      Rails.logger.info "rescues edit_price function"
    ensure
      Rails.logger.info "completes edit_price function"
    end
    render :text => result
  end

  def delete_price
    begin
      Rails.logger.info "enters delete_price function"
      price=Price.new
      result=price.delete_price(params[:price_id])
      if result=="starts"
        result="Database Server is under Maintenance"
      elsif result=="success"
        result="Price was deleted Successfully"
      elsif result=="failed"
        result="Something went wrong, Please Try again or contact Support Team"
      end
    rescue
      Rails.logger.info "rescues delete_price function"
    ensure
      Rails.logger.info "completes delete_price function"
    end
    render :text => result
  end

  def manage_splunk_hosts
    begin
      Rails.logger.info "enters manage_splunk_hosts function"
    rescue
      Rails.logger.info "rescues manage_splunk_hosts function"
    ensure
      Rails.logger.info "completes manage_splunk_hosts function"
    end
  end

  def add_splunk_host
    begin
      Rails.logger.info "enters add_splunk_host function"
      new_host=SplunkHosts.new
      result=new_host.add_host(params[:host_name],params[:role],params[:env])
      if result=="starts"
        #SupportMail.new_splunk_host_inform_admin(params[:host_name],params[:role])
        result="Database Server is under Maintenance"
      elsif result=="success"
        result="Host was added Successfully"
      elsif result=="failed"
        result="Something went wrong, Please Try again or contact Support Team"
      end
    rescue
      Rails.logger.info "rescues add_splunk_host  function"
    ensure
      Rails.logger.info "completes add_splunk_host  function"
    end
    render :text => result
  end

  def show_splunk_hosts
    begin
      Rails.logger.info "enters show_splunk_hosts function"
      get_host=SplunkHosts.new
      Rails.logger.info "got new instance"
      hosts=get_host.get_hosts
      Rails.logger.info "called func"
      render :json => hosts
    rescue
      Rails.logger.info "rescues show_splunk_hosts  function"
    ensure
      Rails.logger.info "completes show_splunk_hosts  function"
    end
  end


  def edit_splunk_host
    begin
      Rails.logger.info "enters edit_splunk_host function"
      new_host=SplunkHosts.new
      result=new_host.update_host(params[:host_name],params[:role],params[:host],params[:env])
      if result=="starts"
        #SupportMail.new_splunk_host_inform_admin(params[:host_name],params[:role])
        result="Database Server is under Maintenance"
      elsif result=="success"
        result="Host was updated Successfully"
      elsif result=="failed"
        result="Something went wrong, Please Try again or contact Support Team"
      end
    rescue
      Rails.logger.info "rescues edit_splunk_host  function"
    ensure
      Rails.logger.info "completes edit_splunk_host  function"
    end
    render :text => result
  end


  def delete_splunk_host
    begin
      Rails.logger.info "enters delete_splunk_host function"
      new_host=SplunkHosts.new
      result=new_host.delete_host(params[:host_name],params[:role],params[:host],params[:env])
      if result=="starts"
        #SupportMail.new_splunk_host_inform_admin(params[:host_name],params[:role])
        result="Database Server is under Maintenance"
      elsif result=="success"
        result="Host was deleted Successfully"
      elsif result=="failed"
        result="Something went wrong, Please Try again or contact Support Team"
      end
    rescue
      Rails.logger.info "rescues delete_splunk_host  function"
    ensure
      Rails.logger.info "completes delete_splunk_host  function"
    end
    render :text => result
  end


  def manage_announcements
    begin
      Rails.logger.info "enters manage_announcements function"
    rescue
      Rails.logger.info "rescues manage_announcements  function"
    ensure
      Rails.logger.info "completes manage_announcements  function"
    end
  end

  def add_announcement
    begin
      Rails.logger.info "enters add_announcement function"
      new_announcement=Announcements.new
      result=new_announcement.add_announcement(params[:announce],params[:status])
      if result=="starts"
        result="Database Server is under Maintenance"
      elsif result=="success"
        result="Announcement was added Successfully"
      elsif result=="failed"
        result="Something went wrong, Please Try again or contact Support Team"
      end
    rescue
      Rails.logger.info "rescues add_announcement function"
    ensure
      Rails.logger.info "completes add_announcement function"
    end
    render :text => result
  end

  def edit_announcement
    begin
      Rails.logger.info "enters edit_announcement function"
      edit_announcement=Announcements.new
      result=edit_announcement.update_announcement(params[:announce],params[:announcement],params[:status])
      if result=="starts"
        result="Database Server is under Maintenance"
      elsif result=="success"
        result="Announcement was updated Successfully"
      elsif result=="failed"
        result="Something went wrong, Please Try again or contact Support Team"
      end
    rescue
      Rails.logger.info "rescues edit_announcement function"
    ensure
      Rails.logger.info "completes edit_announcement function"
    end
    render :text => result
  end


  def delete_announcement
    begin
      Rails.logger.info "enters delete_announcement function"
      delete_announcement=Announcements.new
      result=delete_announcement.delete_announcement(params[:announce],params[:announcement])
      if result=="starts"
        result="Database Server is under Maintenance"
      elsif result=="success"
        result="Announcement was Deleted Successfully"
      elsif result=="failed"
        result="Something went wrong, Please Try again or contact Support Team"
      end
    rescue
      Rails.logger.info "rescues delete_announcement function"
    ensure
      Rails.logger.info "completes delete_announcement function"
    end
    render :text => result
  end

  def get_announcements
    begin
      Rails.logger.info "enters the get_announcements function"
      result="started"
      announcements=Announcements.new
      result=announcements.get_announcements("admin")
    rescue
      result="failed"
      Rails.logger.info "rescues the get_announcements function"
    ensure
      Rails.logger.info "completes the get_announcements function"
    end
    render :json => result
  end

  def test_get
    begin
      Rails.logger.info "enters the get_announcements function"
      result="started"
    rescue
      result="failed"
      Rails.logger.info "rescues the get_announcements function"
    ensure
      Rails.logger.info "completes the get_announcements function"
    end
  end

  def get_portal_users
    begin
      Rails.logger.info "enters the get_portal_users function"
      result="starts"
      get_portal_users=CreateUser.new
      portal_users=get_portal_users.get_all_records
      get_splunk_host=SplunkHosts.new
      splunk_host=get_splunk_host.get_sh_record_by_name(params[:host])
      get_splunk_users=SplunkUser.new
      splunk_users=get_splunk_users.get_all_records_for_sh_by_id(splunk_host.id)
      Rails.logger.info "got splunk users"
      potential_accounts=Array.new
      portal_users.each do |portal|
        flag=0
        splunk_users.each do |splunk|
          if portal.id==splunk.create_user_id
             flag=1
             break
          else
             flag=0
          end
        end
        if flag==0
             potential_accounts.push(portal)
        end
      end
      result=potential_accounts
    rescue
      result="failed"
      Rails.logger.info "rescues the get_portal_users function"
    ensure
      Rails.logger.info "completes the get_portal_users function"
    end
    render :json => result
  end


  def get_portal_user_information
    begin
      Rails.logger.info "enters the get_portal_user_information function"
      result="starts"
      get_portal_user_information=CreateUser.new
      portal_user_information=get_portal_user_information.get_record_by_name(params[:portal_user])
      result=portal_user_information
    rescue
      result="failed"
      Rails.logger.info "rescues the get_portal_user_information function"
    ensure
      Rails.logger.info "completes the get_portal_user_information function"
    end
    render :json => result
  end

  def statistics_splunk_hosts
    begin
      Rails.logger.info "enters statistics_splunk_hosts function"
      get_statistics=SplunkHosts.new
      Rails.logger.info "got new instance"
      statistics=get_statistics.get_hosts_statistics
      render :json => statistics
    rescue
      Rails.logger.info "rescues statistics_splunk_hosts  function"
    ensure
      Rails.logger.info "completes statistics_splunk_hosts  function"
    end
  end


  def statistics_portal_accounts
    begin
      Rails.logger.info "enters statistics_portal_accounts function"
      get_statistics=CreateUser.new
      statistics=get_statistics.get_accounts_statistics
      render :json => statistics
    rescue
      Rails.logger.info "rescues statistics_portal_accounts function"
    ensure
      Rails.logger.info "completes statistics_portal_accounts function"
    end
  end

  def statistics_splunk_users
    begin
      Rails.logger.info "enters statistics_splunk_users function"
      get_statistics=SplunkUser.new
      statistics=get_statistics.get_users_statistics
      render :json => statistics
    rescue
      Rails.logger.info "rescues statistics_splunk_users function"
    ensure
      Rails.logger.info "completes statistics_splunk_users function"
    end
  end

  def statistics_input_logs
    begin
      Rails.logger.info "enters statistics_input_logs function"
      get_statistics=InputLog.new
      statistics=get_statistics.get_statistics
      render :json => statistics
    rescue
      Rails.logger.info "rescues statistics_input_logs function"
    ensure
      Rails.logger.info "completes statistics_input_logs function"
    end
  end

  def manage_user_forwarders
    begin
      Rails.logger.info "enters manage_user_forwarders function"
    rescue
      Rails.logger.info "rescues manage_user_forwarders function"
    ensure
      Rails.logger.info "completes manage_user_forwarders function"
    end
  end

  def get_user_forwarders
    begin
      Rails.logger.info "enters get_user_forwarders function"
      get_forwarders_list=Forwarder.new
      forwarders_list=get_forwarders_list.get_records_for_admin
      result=forwarders_list
    rescue
      Rails.logger.info "rescues get_user_forwarders function"
    ensure
      Rails.logger.info "completes get_user_forwarders function"
    end
    render :json => result
  end

  def user_forwarders_suggest_change
    begin
      Rails.logger.info "enters user_forwarders_suggest_change function"
      suggest_change=Forwarder.new
      suggest_change.suggest_changes(params[:forwarder],params[:new_name])
    rescue
      Rails.logger.info "rescues user_forwarders_suggest_change function"
    ensure
      Rails.logger.info "completes user_forwarders_suggest_change function"
    end
  end


  def suggest_change_user_inputs
    begin
      Rails.logger.info "enters suggest_change_user_inputs function"
      suggest_change=InputLog.new
      suggest_change.suggest_changes(params[:new_log_file_path],params[:old_log_file_path],params[:new_source_type],params[:old_source_type],params[:new_log_file_size],params[:old_log_file_size],params[:new_log_retention_period],params[:old_log_retention_period],params[:new_memo],params[:old_memo],params[:new_crcsalt],params[:old_crcsalt],params[:input])
      result="success"
    rescue
      result="fails"
      Rails.logger.info "rescues suggest_change_user_inputs function"
    ensure
      Rails.logger.info "completes suggest_change_user_inputs function"
    end
    render :text => result
  end

  def list_user_forwarders
    begin
      Rails.logger.info "enters the list_user_forwarders function"
      result="started"
      list_forwarders=Forwarder.new
      if params[:request_by]!=nil
        get_user_id=SplunkUser.new
        get_splunk_user_id=InputLog.new
        splunk_user_id=get_splunk_user_id.get_record_for("splunk_users_id","id",params[:input])
        user_id=get_user_id.get_record_for("create_user_id","id",splunk_user_id.splunk_users_id)
        forwarders=list_forwarders.get_records_for("name","create_user_id",user_id.create_user_id)
      end
      result=forwarders
    rescue
      result="failed"
      Rails.logger.info "rescues the list_user_forwarders function"
    ensure
      Rails.logger.info "completes the list_user_forwarders function"
    end
    render :json => result
  end

  def report_inputs
    begin
      Rails.logger.info "enters report_inputs function"
      result = "starts"
      @input=InputLog.where(["id=?", params[:id]]).first
      user=SplunkUser.where(["id = ?", @input.splunk_users_id]).select("create_user_id").first
      user_name=CreateUser.where(["id=?",user.create_user_id]).select("splunk_user_name").first
      if @input.app_id != nil
        get_env = App.new
        temp_env = get_env.get_record_for("env","id",@input.app_id)
        @env = temp_env.env
      else
        @env = "Not Yet Associated"
      end
      @account_name=user_name.splunk_user_name
      @log_file_path=@input.log_file_path
      @sourcetype=@input.sourcetype
      @log_file_size=@input.log_file_size
      @data_retention_period=@input.data_retention_period
      @memo=@input.memo
      @crcsalt=@input.crcsalt
      @status=@input.status
      blacklist = @input.blacklist
      if blacklist == nil
        @blacklist = "No Blacklist Provided"
      else
        @blacklist = blacklist
      end
      @unixapp_link = CONF["unixapp_link"]
      @scriptname = @input.script_name
      @interval = @input.interval
      @os = @input.os
      @option = @input.option
      @display="inputs"
    rescue
      result = "fails"
      Rails.logger.info "rescues report_inputs function"
    ensure
      Rails.logger.info "completes report_inputs function"
    end
  end

  def show_user_apps
    begin
      Rails.logger.info "enters show_user_apps function"
      result = "starts"
    rescue
      result = "fails"
      Rails.logger.info "rescues show_user_apps function"
    ensure
      Rails.logger.info "completes show_user_apps function"
    end
  end

  def list_user_apps
    begin
      Rails.logger.info "enters list_user_apps function"
      result = "starts"
      get_list_user_apps = App.new
      list_user_apps = get_list_user_apps.list_user_apps()
      result = list_user_apps
    rescue
      result = "fails"
      Rails.logger.info "rescues list_user_apps function"
    ensure
      Rails.logger.info "completes list_user_apps function"
    end
    render :json => result
  end

  def report_apps
    begin
      Rails.logger.info "enters report_apps function"
      result = "starts"
      report_app = DeploySetting.new
      @result = report_app.app_deploy_settings("",params[:id],"","")
      email_content = @result
      get_app_details = App.new
      get_server_class_details = ServerClass.new
      get_splunk_hosts = SplunkHosts.new
      generate_conf_data = InputLog.new
      get_user_details = CreateUser.new
      app_server_class_record = Array.new
      splunk_user_record = SplunkUser.new
      user_id = get_app_details.get_record_for("create_user_id","id",params[:id])
      user_name = get_user_details.get_record_for("splunk_user_name","id",user_id.create_user_id)
      # host_id = splunk_user_record.get_record_for("splunk_host_id", "create_user_id", user_id)


      @user_name = user_name.splunk_user_name
      @app = params[:id]
      @server_forwarder_email = Array.new
      @app_name_email = ""
      @input_logs = Array.new
      @dotconf_assist_domain = CONF["dotconf_assist_domain"]
      @white_list = Array.new
      @inputs_conf_data = ""
      forwarders_index = email_content.index("forwarders_end")
      forwarders = email_content.slice!(0..forwarders_index)
      server_class_index = forwarders.index("Server Class ends")
      app_server_classes = report_app.get_all_records_for("server_class_id","app_id",params[:id])
      app_server_classes.each do |app_server_class|
        temp_record = get_server_class_details.get_record("id", app_server_class.server_class_id)
        app_server_class_record.push(temp_record)
      end
      while server_class_index!=nil do
        #server_class = forwarders.slice!(0..server_class_index)
        server_class = forwarders.slice!(0..server_class_index)
        server_class_name = server_class.slice!(0)
        if server_class_name != "forwarders_end" and server_class_name != "Server Class ends"
          @server_forwarder_email.push(server_class_name)
          whitelist = ""
          app_server_class_record.each do |record|
            if server_class_name == record.name
              whitelist = get_server_class_details.get_record_for("regex","id",record.id)
            end
          end
          #@white_list.push(whitelist.regex)
          @white_list.push("")
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
      @inputids = ""
      @app_name_email = email_content.slice!(0)
      email_content.each do |input_log|
        @inputs_conf_data = @inputs_conf_data + generate_conf_data.generateconf(input_log) #this is shown in create deployment app window for admin to confirm the inputs.conf content
        @input_logs.push(input_log)
        @inputids = @inputids + "#{input_log}" + ","
      end
      @inputids = @inputids[0, @inputids.length - 1] #start_pos and length
      # output of inputs_conf_data can contain "crcSalt=<SOURCE>" even use "crcsalt = "crcSalt=\<SOURCE\><br>"" in input_log.rb
      # but it just shows "crcSalt=" in textarea in report_apps_html.erb using @inputs_conf_data
      app_name = get_app_details.get_record_for("name","id",@app)
      @app_name = app_name.name
      temp_env = get_app_details.get_record_for("env","id",@app)
      @env = temp_env.env
      @deploy_hosts = get_splunk_hosts.get_all_deploy_hosts_names_for_env("env", temp_env.env, "role", "DPLY")#used in report_apps.html.erb
      @search_hosts = get_splunk_hosts.get_all_deploy_hosts_names_for_env("env", temp_env.env, "role", "SH") #used in report_apps.html.erb

      splunk_user = splunk_user_record.get_splunk_user_for_input_log("splunk_host_id", "env", temp_env.env, "create_user_id", user_id.create_user_id)
      @user_searchhead = get_splunk_hosts.get_record_for("name", "id", splunk_user.splunk_host_id) #used in report_apps.html.erb

    rescue
      result = "fails"
      Rails.logger.info "rescues report_apps function"
    ensure
      Rails.logger.info "completes report_apps function"
    end
  end

  def approve_user_app
    begin
      Rails.logger.info "enters approve_user_app function"
      result = "starts"
      approve_user_app = DeploySetting.new
      result = approve_user_app.approve_app_deploy_settings(params[:app], params[:message_user])
    rescue
      result = "fails"
      Rails.logger.info "rescues approve_user_app function"
    ensure
      Rails.logger.info "completes approve_user_app function"
    end
    render :text => result
  end

  def cancel_user_app
    begin
      Rails.logger.info "enters cancel_user_app function"
      result = "starts"
      cancel_user_app = DeploySetting.new
      puts params[:message_user]
      result = cancel_user_app.cancel_app_deploy_settings(params[:app],params[:message_user])
    rescue
      result = "fails"
      Rails.logger.info "rescues cancel_user_app function"
    ensure
      Rails.logger.info "completes cancel_user_app function"
    end
    render :text => result
  end

  def create_server_class
    begin
      Rails.logger.info "enters create_server_class function"
      result = "starts"
      create_server_class = ServerClass.new
      result = create_server_class.create_server_class(params[:app],params[:deploy_host],params[:forwarders],params[:classes])
    rescue
      result = "fails"
      Rails.logger.info "rescues create_server_class function"
    ensure
      Rails.logger.info "completes create_server_class function"
    end
    render :text => result
  end

  def report_splunk_account
    begin
      Rails.logger.info "enters report_splunk_account function"
      result = "starts"
      get_splunk_account = SplunkUser.new
      @user_account, @splunk_account, @host_name = get_splunk_account.get_splunk_account(params[:id])
    rescue
      result = "fails"
      Rails.logger.info "rescues report_splunk_account function"
    ensure
      Rails.logger.info "completes report_splunk_account function"
    end
  end

  def create_deployment_app
    begin
      Rails.logger.info "enters create_deployment_app function"
      result = "starts"
      create_deployment_app = App.new
      result = create_deployment_app.create_deployment_app(params[:deploy_host], params[:username], params[:password], params[:app_data], params[:inputids], params[:env])
    rescue
      result = "fails"
      Rails.logger.info "rescues create_deployment_app function"
    ensure
      Rails.logger.info "completes create_deployment_app function"
    end
    render :text => result
  end

  def get_tags
    begin
      Rails.logger.info "enters get_tags function"
      result = "starts"
      tags = ServerClass.new
      result = tags.get_tags(params[:search_host], params[:user])
    rescue
      result = "fails"
      Rails.logger.info "rescues get_tags function"
    ensure
      Rails.logger.info "completes get_tags function"
    end
    render :json => result
  end

  def create_tag
    begin
      Rails.logger.info "enters create_tag function"
      result = "starts"
      tags = ServerClass.new
      tag_name = params[:tag_name]
      if params[:tag_name].index(",") != nil #if no new tag created
        tag_name = params[:tag_name].slice(0..(params[:tag_name].index(",")-1)) #tag name is tag_*.  full str:tag_ad_cpc, host-...
      end
      result = tags.create_tag(tag_name, params[:search_host], params[:host_names])
      if result == "success"
        result = "Tag Created On Search Head! Permissions have been set to GLOBAL successfully!"
      elsif result != "fails"
        result = "Tag Created On Search Head! " + result
      end

    rescue
      result = "fails"
      Rails.logger.info "rescues create_tag function"
    ensure
      Rails.logger.info "completes create_tag function"
    end
    render :text => result
  end

protected

def must_be_post
  unless request.method == "POST"
    #render :text => "not done"
    redirect_to "/admin/home"
  end
end

end
