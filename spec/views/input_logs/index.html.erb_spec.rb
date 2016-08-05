require 'rails_helper'

RSpec.describe "input_logs/index", :type => :view do
  before(:each) do
    assign(:input_logs, [
      InputLog.create!(
        :splunk_user_id => 1,
        :source_hostname => "Source Hostname",
        :log_file_path => "Log File Path",
        :sourcetype => "Sourcetype",
        :log_file_size => "Log File Size",
        :data_retention_period => "Data Retention Period",
        :memo => "MyText"
      ),
      InputLog.create!(
        :splunk_user_id => 1,
        :source_hostname => "Source Hostname",
        :log_file_path => "Log File Path",
        :sourcetype => "Sourcetype",
        :log_file_size => "Log File Size",
        :data_retention_period => "Data Retention Period",
        :memo => "MyText"
      )
    ])
  end

  it "renders a list of input_logs" do
    render
    assert_select "tr>td", :text => 1.to_s, :count => 2
    assert_select "tr>td", :text => "Source Hostname".to_s, :count => 2
    assert_select "tr>td", :text => "Log File Path".to_s, :count => 2
    assert_select "tr>td", :text => "Sourcetype".to_s, :count => 2
    assert_select "tr>td", :text => "Log File Size".to_s, :count => 2
    assert_select "tr>td", :text => "Data Retention Period".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
  end
end
