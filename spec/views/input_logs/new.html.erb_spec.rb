require 'rails_helper'

RSpec.describe "input_logs/new", :type => :view do
  before(:each) do
    assign(:input_log, InputLog.new(
      :splunk_user_id => 1,
      :source_hostname => "MyString",
      :log_file_path => "MyString",
      :sourcetype => "MyString",
      :log_file_size => "MyString",
      :data_retention_period => "MyString",
      :memo => "MyText"
    ))
  end

  it "renders new input_log form" do
    render

    assert_select "form[action=?][method=?]", input_logs_path, "post" do

      assert_select "input#input_log_splunk_user_id[name=?]", "input_log[splunk_user_id]"

      assert_select "input#input_log_source_hostname[name=?]", "input_log[source_hostname]"

      assert_select "input#input_log_log_file_path[name=?]", "input_log[log_file_path]"

      assert_select "input#input_log_sourcetype[name=?]", "input_log[sourcetype]"

      assert_select "input#input_log_log_file_size[name=?]", "input_log[log_file_size]"

      assert_select "input#input_log_data_retention_period[name=?]", "input_log[data_retention_period]"

      assert_select "textarea#input_log_memo[name=?]", "input_log[memo]"
    end
  end
end
