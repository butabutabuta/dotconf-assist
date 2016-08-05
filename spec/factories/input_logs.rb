# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :input_log do
    splunk_user_id 1
    source_hostname "MyString"
    log_file_path "MyString"
    sourcetype "MyString"
    log_file_size "MyString"
    data_retention_period "MyString"
    memo "MyText"
  end
end
