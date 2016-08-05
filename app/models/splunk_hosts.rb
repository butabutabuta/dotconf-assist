class SplunkHosts < ActiveRecord::Base

  def add_host(name,role,env)
    begin
      result="starts"
      Rails.logger.info "enters add_host function"
      new_host=SplunkHosts.new
      new_host.name=name
      new_host.role=role
      new_host.env=env
      new_host.save
      result="success"
    rescue
      result="failed"
      Rails.logger.info "rescues add_host function"
    ensure
      Rails.logger.info "completes add_host function"
    end
    return(result)
  end


  def get_hosts
    begin
      Rails.logger.info "enters get_hosts function"
      result="starts"
      hosts=SplunkHosts.select(:id, :name, :role, :env).order(:env)
      result=hosts
    rescue
      result="failed"
      Rails.logger.info "rescues get_hosts function"
    ensure
      Rails.logger.info "completes get_hosts function"
    end
    return(result)
  end

  def update_host(name,role,host,env)
    begin
      result="starts"
      Rails.logger.info "enters update_host function"
      new_host=SplunkHosts.where(["id=?",host]).first
      new_host.name=name
      new_host.role=role
      new_host.env=env
      new_host.save
      result="success"
    rescue
      result="failed"
      Rails.logger.info "rescues update_host function"
    ensure
      Rails.logger.info "completes update_host function"
    end
    return(result)
  end

  def delete_host(name,role,host,env)
    begin
      result="starts"
      Rails.logger.info "enters delete_host function"
      new_host=SplunkHosts.where(["id=?",host]).first
      new_host.delete
      result="success"
    rescue
      result="failed"
      Rails.logger.info "rescues delete_host function"
    ensure
      Rails.logger.info "completes delete_host function"
    end
    return(result)
  end

  def get_sh_record_by_name(record_name)
    begin
      Rails.logger.info "enters get_sh_record_by_name function"
      get_record=SplunkHosts.where(["name=? and role=?",record_name,"SH"]).first
      result=get_record
    rescue
      result="failed"
      Rails.logger.info "rescues get_sh_record_by_name function"
    ensure
      Rails.logger.info "completes get_sh_record_by_name function"
    end
    return(result)
  end



  def get_env_statistics(env)
    begin
      Rails.logger.info "enters get_env_statistics function"
      result="starts"
      statistics=Array.new
      env_statistics=SplunkHosts.select(:id, :name, :role).where(["env=?",env])
      host_count=0
      sh_count=0
      fw_count=0
      idx_count=0
      dply_count=0
      master_count=0
      env_statistics.each do |host|
        if host.role=="SH"
          sh_count+=1
        elsif host.role=="IDX"
          idx_count+=1
        elsif host.role=="DPLY"
          dply_count+=1
        elsif host.role=="FW"
          fw_count+=1
        elsif host.role=="MASTER"
          master_count+=1
        end
        host_count+=1
      end
      zip_sh=Array.new
      zip_idx=Array.new
      zip_fw=Array.new
      zip_dply=Array.new
      zip_master=Array.new
      zip_host=Array.new
      zip_env=Array.new
      zip_sh.push("Search Heads")
      zip_idx.push("Indexers")
      zip_fw.push("Forwarders")
      zip_dply.push("Deploy")
      zip_master.push("Master")
      zip_host.push("Hosts")
      zip_env.push("Environment")
      env_sh_count=Array.new
      env_fw_count=Array.new
      env_idx_count=Array.new
      env_dply_count=Array.new
      env_master_count=Array.new
      env_host_count=Array.new
      env_name=Array.new
      env_sh_count.push(sh_count)
      env_idx_count.push(idx_count)
      env_fw_count.push(fw_count)
      env_dply_count.push(dply_count)
      env_master_count.push(master_count)
      env_host_count.push(host_count)
      env_name.push(env)
      zip_sh=zip_sh.zip(env_sh_count)
      zip_idx=zip_idx.zip(env_idx_count)
      zip_fw=zip_fw.zip(env_fw_count)
      zip_dply=zip_dply.zip(env_dply_count)
      zip_master=zip_master.zip(env_master_count)
      zip_host=zip_host.zip(env_host_count)
      zip_env=zip_env.zip(env_name)
      statistics.push(zip_env)
      statistics.push(zip_host)
      statistics.push(zip_sh)
      statistics.push(zip_idx)
      statistics.push(zip_fw)
      statistics.push(zip_dply)
      statistics.push(zip_master)
      result=statistics
    rescue
      result="failed"
      Rails.logger.info "rescues get_env_statistics function"
    ensure
      Rails.logger.info "completes get_env_statistics function"
    end
    return(result)
  end

  def get_hosts_statistics
    begin
      Rails.logger.info "enters get_hosts_statistics function"
      result="starts"
      statistics=Array.new
      get_statistics=SplunkHosts.new
      dev_statistics=get_statistics.get_env_statistics("dev")
      statistics.push(dev_statistics)
      stg_statistics=get_statistics.get_env_statistics("stg")
      statistics.push(stg_statistics)
      prod_statistics=get_statistics.get_env_statistics("prod")
      statistics.push(prod_statistics)
      result=statistics
    rescue
      result="failed"
      Rails.logger.info "rescues get_hosts_statistics function"
    ensure
      Rails.logger.info "completes get_hosts_statistics function"
    end
    return(result)
  end

  def get_all_deploy_hosts_names_for_env(env_attribute,env_value,where_attribute,where_value)
    begin
      result="starts"
      Rails.logger.info "enters get_all_deploy_hosts_names_for_env #{env_value} function"
      deploy_names = Array.new
      get_all_records = SplunkHosts.where(["#{where_attribute} = ? and #{env_attribute} = ?",where_value, env_value]).select(:name)
      get_all_records.each do |splunk_host|
        deploy_names.push(splunk_host.name)
      end
      result= deploy_names
    rescue
      result="fails"
      Rails.logger.info "rescues get_all_deploy_hosts_names_for_env #{env_value} function"
    ensure
      Rails.logger.info "completes get_all_deploy_hosts_names_for_env #{env_value} function"
    end
    return(result)
  end

  def get_record_for(attribute,where_attribute,where_value)
    begin
      result="starts"
      Rails.logger.info "enters get_record_for #{attribute} function"
      get_record_for = SplunkHosts.where(["#{where_attribute} = ?",where_value]).select(attribute).first
      result= get_record_for
    rescue
      result="fails"
      Rails.logger.info "rescues get_record_for #{attribute} function"
    ensure
      Rails.logger.info "completes get_record_for #{attribute} function"
    end
    return(result)
  end

end
