class Authentication < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable
  def changePassword(user_id,old_password,new_password)
    begin
      Rails.logger.info "in model changePassword function"
      user=Authentication.where(["id =?", user_id]).first
      if user.valid_password?(old_password)
        generate_password=CreateUser.new
        new_password=generate_password.create_password(new_password)
        user.encrypted_password=new_password
        user.save
        #@changeuser=user
        #sign_in user, :bypass => true
        Rails.logger.info "updated password at server database"
        result="success"
      else
        result="Please enter correct Old Password"
      end
    rescue
      Rails.logger.info "rescues model changePassword function"
      result="Server is under maintenance, Please Try again Later!"
    ensure
      Rails.logger.info "completes model changePassword function"
    end
    return(result)
  end


  def reset_password(user_name,email)
    begin
      result="no_user"
      Rails.logger.info "enters model reset_password function"
      useuser=Authentication.where(["splunk_user_name=?",user_name]).select("create_user_id").first
      user=CreateUser.where(["id=?",useuser.create_user_id]).first
      #user.email = email
      if user.email != email
        Rails.logger.info "Email Provided does not match Saved Email.Skipping Password reset process."
        result = "Invalid Email"
        Rails.logger.info "Skipping the method " + by_this_undefined_variable
      end
      test=user.id
      result="failed"
      random_password = Array.new(10).map { (65 + rand(58)).chr }.join
      useuser=CreateUser.new
      generate_password=useuser.create_password(random_password)
      if generate_password!="failed"
        result="success"
        if user.email!=nil
           SupportMail.resetpassword_email(user_name,user.email,random_password).deliver
           user=Authentication.where(["create_user_id=?",user.id]).first
           user.encrypted_password=generate_password
           user.save
           Rails.logger.info "email present"
        else
           if email!=""
              SupportMail.resetpassword_email(user_name,email,random_password).deliver
              user=Authentication.where(["create_user_id=?",user.id]).first
              user.encrypted_password=generate_password
              user.save
           else
              result="no email"
              SupportMail.noemailerror_email(user_name).deliver
              #SupportEmail.noemailerror_email().deliver
           end
        end
      end
    rescue
      Rails.logger.info "rescues model reset_password function"
    ensure
      Rails.logger.info "completes model reset_password function"
    end
    return(result)
  end

end
