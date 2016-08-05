require 'rails_helper'

RSpec.describe AdminController, :type => :controller do

  describe "GET 'home'" do
    it "returns http success" do
      get 'home'
      expect(response).to be_success
    end
  end

  describe "GET 'accountlist'" do
    it "returns http success" do
      get 'accountlist'
      expect(response).to be_success
    end
  end

  describe "GET 'inputlist'" do
    it "returns http success" do
      get 'inputlist'
      expect(response).to be_success
    end
  end

  describe "GET 'generateconf'" do
    it "returns http success" do
      get 'generateconf'
      expect(response).to be_success
    end
  end

end
