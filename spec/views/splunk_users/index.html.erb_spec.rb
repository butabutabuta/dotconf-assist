require 'rails_helper'

RSpec.describe "splunk_users/index", :type => :view do
  before(:each) do
    assign(:splunk_users, [
      SplunkUser.create!(
        :user_name => "User Name",
        :group_name => "Group Name",
        :app_team_name => "App Team Name",
        :serviceid => 1,
        :rpaas_user_flg => false,
        :memo => "MyText"
      ),
      SplunkUser.create!(
        :user_name => "User Name",
        :group_name => "Group Name",
        :app_team_name => "App Team Name",
        :serviceid => 1,
        :rpaas_user_flg => false,
        :memo => "MyText"
      )
    ])
  end

  it "renders a list of splunk_users" do
    render
    assert_select "tr>td", :text => "User Name".to_s, :count => 2
    assert_select "tr>td", :text => "Group Name".to_s, :count => 2
    assert_select "tr>td", :text => "App Team Name".to_s, :count => 2
    assert_select "tr>td", :text => 1.to_s, :count => 2
    assert_select "tr>td", :text => false.to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
  end
end
