require 'rails_helper'

RSpec.describe "splunk_users/edit", :type => :view do
  before(:each) do
    @splunk_user = assign(:splunk_user, SplunkUser.create!(
      :user_name => "MyString",
      :group_name => "MyString",
      :app_team_name => "MyString",
      :serviceid => 1,
      :rpaas_user_flg => false,
      :memo => "MyText"
    ))
  end

  it "renders the edit splunk_user form" do
    render

    assert_select "form[action=?][method=?]", splunk_user_path(@splunk_user), "post" do

      assert_select "input#splunk_user_user_name[name=?]", "splunk_user[user_name]"

      assert_select "input#splunk_user_group_name[name=?]", "splunk_user[group_name]"

      assert_select "input#splunk_user_app_team_name[name=?]", "splunk_user[app_team_name]"

      assert_select "input#splunk_user_serviceid[name=?]", "splunk_user[serviceid]"

      assert_select "input#splunk_user_rpaas_user_flg[name=?]", "splunk_user[rpaas_user_flg]"

      assert_select "textarea#splunk_user_memo[name=?]", "splunk_user[memo]"
    end
  end
end
