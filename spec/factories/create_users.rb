# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :create_user do
    email "MyString"
    splunk_user_name "MyString"
    password "MyString"
    salt "MyString"
  end
end
