require 'rails_helper'

RSpec.describe "InputLogs", :type => :request do
  describe "GET /input_logs" do
    it "works! (now write some real specs)" do
      get input_logs_path
      expect(response.status).to be(200)
    end
  end
end
