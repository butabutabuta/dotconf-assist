class CreateUser < ActiveRecord::Base

  def saveuser(user,password)
    begin
      Rails.logger.info "enters saveuser function"
      new_password=user.create_password(password)
      if new_password!="failed"
        user.password=new_password
        user.salt=salt
        user.save
      end
      result=user
    rescue
      Rails.logger.info "rescues saveuser function"
    ensure
      Rails.logger.info "completes saveuser function"
    end
    return result
  end

  def create_password(password)
    begin
      Rails.logger.info "enters create_password function"
      salt = BCrypt::Engine.generate_salt
      new_password = BCrypt::Engine.hash_secret(password, salt)
    rescue
      new_password="failed"
      Rails.logger.info "rescues create_password function"
    ensure
      Rails.logger.info "completes create_password function"
    end
    return(new_password)
  end

  def authenticate_user(user,password)
    begin
      Rails.logger.info "enters authenticate_user function"
      hash=BCrypt::Engine.hash_secret(password, user.salt)
      if hash==user.password
        result=hash
      else
        result="fails"
      end
    rescue
      Rails.logger.info "rescues authenticate_user function"
    ensure
      Rails.logger.info "completes authenticate_user function"
    end
    return(result)
  end

  def request_account(user_name,email,email_emergency,app_team_name,group_name,service_id,password)
    begin
      Rails.logger.info "enters request_account function[create_user.rb]"
      user=CreateUser.new
      user.splunk_user_name=user_name
      user.status=0
      if email==nil or email==""
        user.email=nil
      else
        user.email=email
      end
      if email_emergency==nil or email_emergency==""
        user.email_for_emergency=nil
      else
        user.email_for_emergency=email_emergency
      end
      user.app_team_name=app_team_name
      user.group_name=group_name
      user.serviceid=service_id
      result=user.saveuser(user,password)
      if user.email!=nil and email!=""
        SupportMail.newaccount_email(user).deliver
      else
         Rails.logger.info "Invalid user email"
      end
      SupportMail.newaccountinformadmin_email(user).deliver
      result=result.id
      rescue => e
      Rails.logger.info e.message
      result="failed"
      Rails.logger.info "rescues request_account function[create_user.rb]"
    ensure
      Rails.logger.info "completes request_account function[create_user.rb]"
    end
    return(result)
  end

  def approve_account_request(user)
    begin
      Rails.logger.info "enters approve_account_request[create_user.rb]"
      user=CreateUser.where(["id= ?",user]).first
      user.status=1
      new_authentication=Authentication.new
      new_authentication.splunk_user_name=user.splunk_user_name
      new_authentication.encrypted_password=user.password
      new_authentication.create_user_id=user.id
      new_authentication.save
      user.save
      if user.email!= nil and user.email != ""
        SupportMail.account_approve_email(user).deliver
      else
        Rails.logger.info "User has Not Provided Email"
      end
      SupportMail.account_approve_inform_admin_email(user).deliver
    rescue => e
      Rails.logger.info "rescues approve_account_request[create_user.rb]"
    ensure
      Rails.logger.info "completes approve_account_request[create_user.rb]"
    end
  end


  def cancel_account_request(user)
    begin
      Rails.logger.info "enters cancel_account_request"
      user=CreateUser.where(["id= ?",user]).first
      user.status=9
      user.save
      if user.email!= nil and user.email != ""
        SupportMail.account_cancel_email(user).deliver
      else
        Rails.logger.info "User has Not Provided Email"
      end
      SupportMail.account_cancel_inform_admin_email(user).deliver
    rescue
      Rails.logger.info "rescues cancel_account_request"
    ensure
      Rails.logger.info "completes cancel_account_request"
    end
  end

  def get_record(record_id)
    begin
      Rails.logger.info "enters get_record function"
      get_record=CreateUser.where(["id=?",record_id]).first
      result=get_record
    rescue
      result="failed"
      Rails.logger.info "rescues get_record function"
    ensure
      Rails.logger.info "completes get_record function"
    end
    return(result)
  end


  def get_all_records
    begin
      Rails.logger.info "enters get_all_record function"
      get_record=CreateUser.select(:id,:email,:splunk_user_name,:group_name,:app_team_name,:serviceid,:status,:created_at)
      result=get_record
    rescue
      result="failed"
      Rails.logger.info "rescues get_all_record function"
    ensure
      Rails.logger.info "completes get_all_record function"
    end
    return(result)
  end

  def get_record_by_name(record_name)
    begin
      Rails.logger.info "enters get_record_by_name function"
      get_record=CreateUser.select(:id,:email,:splunk_user_name,:group_name,:app_team_name,:serviceid).where(["splunk_user_name=?",record_name]).first
      result=get_record
    rescue
      result="failed"
      Rails.logger.info "rescues get_record_by_name function"
    ensure
      Rails.logger.info "completes get_record_by_name function"
    end
    return(result)
  end

  def get_accounts_statistics
    begin
      Rails.logger.info "enters get_accounts_statistics function"
      result="starts"
      statistics=Array.new
      get_all_records=CreateUser.new
      all_records=get_all_records.get_all_records
      users_count=0
      accepted_count=0
      rejected_count=0
      pending_count=0
      all_records.each do |user|
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
      accepted_label_array=Array.new
      rejected_label_array=Array.new
      pending_label_array=Array.new
      users_label_array.push("Users")
      accepted_label_array.push("Users Accepted")
      rejected_label_array.push("Users Canceled")
      pending_label_array.push("Pending users")
      users_count_array.push(users_count)
      accepted_count_array.push(accepted_count)
      rejected_count_array.push(rejected_count)
      pending_count_array.push(pending_count)
      users_label_array=users_label_array.zip(users_count_array)
      accepted_label_array=accepted_label_array.zip(accepted_count_array)
      rejected_label_array=rejected_label_array.zip(rejected_count_array)
      pending_label_array=pending_label_array.zip(pending_count_array)
      statistics.push(users_label_array)
      statistics.push(accepted_label_array)
      statistics.push(rejected_label_array)
      statistics.push(pending_label_array)
      result=statistics
    rescue
      result="failed"
      Rails.logger.info "rescues get_accounts_statistics function"
    ensure
      Rails.logger.info "completes get_accounts_statistics function"
    end
    return(result)
  end

  def get_all_records_name
    begin
      Rails.logger.info "enters get_all_records_name function"
      get_records=CreateUser.select(:splunk_user_name).where(["status=?",1])
      result=get_records
    rescue
      result="failed"
      Rails.logger.info "rescues get_all_records_name function"
    ensure
      Rails.logger.info "completes get_all_recors_name function"
    end
    return(result)
  end

  def get_all_records_for(attribute)
    begin
      result="starts"
      Rails.logger.info "enters get_all_records_for function #{attribute}"
      get_all_records_for = CreateUser.select(attribute)
      result= get_all_records_for
    rescue
      result="fails"
      Rails.logger.info "rescues get_all_records_for function #{attribute}"
    ensure
      Rails.logger.info "completes get_all_records_for function #{attribute}"
    end
    return(result)
  end


  def get_record_for(attribute,where_attribute,where_value)
    begin
      result="starts"
      Rails.logger.info "enters get_record_for function #{attribute}"
      get_record_for = CreateUser.where(["#{where_attribute} = ?",where_value]).select(attribute).first
      result= get_record_for
    rescue
      result="fails"
      Rails.logger.info "rescues get_record_for function #{attribute}"
    ensure
      Rails.logger.info "completes get_record_for function #{attribute}"
    end
    return(result)
  end

  def update_profile(user_id, app_team_name, group_name, service_id, email, emergency_email)
    begin
      Rails.logger.info "enters update_profile function"
      result = "starts"
      user = CreateUser.where(["id=?", user_id]).first
      user.email = email
      user.email_for_emergency = emergency_email
      if user.email == ""
         user.email = nil
      end
      if user.email_for_emergency == ""
         user.email_for_emergency = nil
      end
      user.app_team_name = app_team_name
      user.group_name = group_name
      user.serviceid = service_id
      user.save
      result = "updated"
      if email!= ""
        SupportMail.profile_update_email(user).deliver
      else
        Rails.logger.info "Email Address Not Provided."
      end
      SupportMail.profile_update_inform_admin_email(user).deliver
    rescue
      result = "fails"
      Rails.logger.info "rescues update_profile function"
    ensure
      Rails.logger.info "completes update_profile function"
    end
    return(result)
  end

end
