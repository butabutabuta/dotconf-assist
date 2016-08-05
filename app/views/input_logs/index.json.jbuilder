json.array!(@input_logs) do |input_log|
  json.extract! input_log, :id, :splunk_user_id, :source_hostname, :log_file_path, :sourcetype, :log_file_size, :data_retention_period, :memo
  json.url input_log_url(input_log, format: :json)
end
