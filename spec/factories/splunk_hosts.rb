# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :splunk_host, :class => 'SplunkHosts' do
    name "MyString"
    role "MyString"
  end
end
