class Price < ActiveRecord::Base
	def add_price(service_unit_price,storage_unit_price)
	  begin
	    result="starts"
	    Rails.logger.info "enters add_price function"
	    new_price=Price.new
	    new_price.service_unit_price=service_unit_price
	    new_price.storage_unit_price=storage_unit_price
	    new_price.save
	    result="success"
	  rescue
	    result="failed"
	    Rails.logger.info "rescues add_price function"
	  ensure
	    Rails.logger.info "completes add_price function"
	  end
	  return(result)
	end

	def get_price
	  begin
	    Rails.logger.info "enters get_price function"
	    result="starts"
	    price=Price.select(:id, :service_unit_price, :storage_unit_price).order(:id).first
	    result=price
	  rescue
	    result="failed"
	    Rails.logger.info "rescues get_price function"
	  ensure
	    Rails.logger.info "completes get_price function"
	  end
	  return(result)
	end

	def get_prices
	  begin
	    Rails.logger.info "enters get_prices function"
	    result="starts"
	    prices=Price.select(:id, :service_unit_price, :storage_unit_price).order(:id)
	    result=prices
	  rescue
	    result="failed"
	    Rails.logger.info "rescues get_prices function"
	  ensure
	    Rails.logger.info "completes get_prices function"
	  end
	  return(result)
	end

	def update_price(price_id,service_unit_price,storage_unit_price)
	  begin
	    result="starts"
	    Rails.logger.info "enters update_price function"
	    new_price=Price.where(["id=?",price_id]).first
	    new_price.service_unit_price=service_unit_price
	    new_price.storage_unit_price=storage_unit_price
	    new_price.save
	    result="success"
	  rescue
	    result="failed"
	    Rails.logger.info "rescues update_price function"
	  ensure
	    Rails.logger.info "completes update_price function"
	  end
	  return(result)
	end

	def delete_price(price_id)
	  begin
	  	puts price_id
	    result="starts"
	    Rails.logger.info "enters delete_price function"
	    price=Price.where(["id=?",price_id]).first
	    price.delete
	    result="success"
	  rescue
	    result="failed"
	    Rails.logger.info "rescues delete_price function"
	  ensure
	    Rails.logger.info "completes delete_price function"
	  end
	  return(result)
	end
end
