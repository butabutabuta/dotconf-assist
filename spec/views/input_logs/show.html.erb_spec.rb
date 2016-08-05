require 'rails_helper'

RSpec.describe "input_logs/show", :type => :view do
  before(:each) do
    @input_log = assign(:input_log, InputLog.create!(
      :splunk_user_id => 1,
      :source_hostname => "Source Hostname",
      :log_file_path => "Log File Path",
      :sourcetype => "Sourcetype",
      :log_file_size => "Log File Size",
      :data_retention_period => "Data Retention Period",
      :memo => "MyText"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/1/)
    expect(rendered).to match(/Source Hostname/)
    expect(rendered).to match(/Log File Path/)
    expect(rendered).to match(/Sourcetype/)
    expect(rendered).to match(/Log File Size/)
    expect(rendered).to match(/Data Retention Period/)
    expect(rendered).to match(/MyText/)
  end
end
