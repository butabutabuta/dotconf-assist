# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :announcement, :class => 'Announcements' do
    announcement "MyString"
  end
end
