require 'rails_helper'

RSpec.describe "splunk_users/show", :type => :view do
  before(:each) do
    @splunk_user = assign(:splunk_user, SplunkUser.create!(
      :user_name => "User Name",
      :group_name => "Group Name",
      :app_team_name => "App Team Name",
      :serviceid => 1,
      :rpaas_user_flg => false,
      :memo => "MyText"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/User Name/)
    expect(rendered).to match(/Group Name/)
    expect(rendered).to match(/App Team Name/)
    expect(rendered).to match(/1/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/MyText/)
  end
end
