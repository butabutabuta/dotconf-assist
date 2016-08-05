require 'rails_helper'

RSpec.describe "SplunkUsers", :type => :request do
  describe "GET /splunk_users" do
    it "works! (now write some real specs)" do
      get splunk_users_path
      expect(response.status).to be(200)
    end
  end
end
