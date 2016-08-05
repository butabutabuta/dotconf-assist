require 'open-uri'
require 'net/http'

class HttpHelper

	def request_create_post (url_string)
		begin
			Rails.logger.info "enters create_request_post function"
			uri = URI.parse(url_string)
			request = Net::HTTP::Post.new(uri.request_uri)
		rescue
			Rails.logger.info "rescues create_request_post function"
		ensure
			Rails.logger.info "completes create_request_post function"
		end
		return(request)
	end

	def request_create_get (url_string)
		begin
			Rails.logger.info "enters create_request_get function"
			uri = URI.parse(url_string)
			#http = Net::HTTP::Proxy(CONF["proxy_host"], CONF["proxy_port"])
			#http = http.new(uri.host, uri.port)
			request = Net::HTTP::Get.new(uri.request_uri)
		rescue
			Rails.logger.info "rescues create_request_get function"
		ensure
			Rails.logger.info "completes create_request_get function"
		end
		return(request)
	end

	def request_send(url_string, request)
		begin
			Rails.logger.info "enters send_request function"
			uri = URI.parse(url_string)
			http = Net::HTTP::Proxy(CONF["proxy_host"], CONF["proxy_port"])
			http = http.new(uri.host, uri.port)
			response = http.request(request)
		rescue
			Rails.logger.info "rescues send_request function"
		ensure
			Rails.logger.info "completes send_request function"
		end
		return(response)
	end

	def request_set_parameter(request, parameter_name, parameter_value)
		begin
			Rails.logger.info "completes request_set_parameter function"
		rescue
			Rails.logger.info "completes request_set_parameter function"
		ensure
			Rails.logger.info "completes request_set_parameter function"
		end
		return(request)
	end

	def request_set_auth_basic(request, user_name, password)
		begin
			Rails.logger.info "enters request_set_auth_basic function"
			request.basic_auth user_name, password
		rescue
			Rails.logger.info "rescues request_set_auth_basic function"
		ensure
			Rails.logger.info "completes request_set_auth_basic function"
		end
		return(request)
	end
 
end
