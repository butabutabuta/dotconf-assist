# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :splunk_user do
    user_name "MyString"
    group_name "MyString"
    app_team_name "MyString"
    serviceid 1
    rpaas_user_flg false
    memo "MyText"
  end
end
