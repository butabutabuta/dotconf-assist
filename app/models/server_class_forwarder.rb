class ServerClassForwarder < ActiveRecord::Base

  def add_record(server_class_id,forwarder_id)
    begin
      Rails.logger.info "enters add_record function"
      add_record=ServerClassForwarder.new
      add_record.server_class_id = server_class_id
      add_record.forwarder_id = forwarder_id
      add_record.save
    rescue
      Rails.logger.info "completes add_record function"
    ensure
      Rails.logger.info "ensures add_record function"
    end
  end

  def get_all_records_for(attribute, where_attribute, where_value)
    begin
      Rails.logger.info "enters get_all_records_for #{attribute} function"
      records=ServerClassForwarder.where(["#{where_attribute} = ?",where_value]).select(attribute).order("#{attribute}")
      result=records
    rescue
      Rails.logger.info "rescues get_all_records_for #{attribute} function"
    ensure
      Rails.logger.info "completes get_all_records_for #{attribute} function"
    end
    return(result)
  end

  def delete_records_for(attribute,attribute_value)
    begin
      Rails.logger.info "enters delete_record_for #{attribute} function"
      result="starts"
      get_delete_records = ServerClassForwarder.where(["#{attribute} = ?",attribute_value])
      get_delete_records.each do |record|
        record.delete
      end
      result="success"
    rescue
      result="fails"
      Rails.logger.info "rescues delete_record_for #{attribute} function"
    ensure
      Rails.logger.info "completes delete_record_for #{attribute} function"
    end
    return(result)
  end

  def get_user_clients(server_class_id,user_id)
    begin
      Rails.logger.info "enters get_user_clients function"
      result="starts"
      get_ref_records = ServerClassForwarder.new
      get_forwarder_name = Forwarder.new
      clients = Array.new
      ref_records = get_ref_records.get_all_records_for("forwarder_id","server_class_id",server_class_id)
      ref_records.each do |ref_record|
        forwarder_name = get_forwarder_name.get_record_for("name","id",ref_record.forwarder_id)
        clients.push(forwarder_name.name)
      end
      result = clients
    rescue
      result="fails"
      Rails.logger.info "rescues get_user_clients function"
    ensure
      Rails.logger.info "completes get_user_clients function"
    end
    return(result)
  end

end
