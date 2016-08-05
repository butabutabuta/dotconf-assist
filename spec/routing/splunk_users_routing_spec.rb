require "rails_helper"

RSpec.describe SplunkUsersController, :type => :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/splunk_users").to route_to("splunk_users#index")
    end

    it "routes to #new" do
      expect(:get => "/splunk_users/new").to route_to("splunk_users#new")
    end

    it "routes to #show" do
      expect(:get => "/splunk_users/1").to route_to("splunk_users#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/splunk_users/1/edit").to route_to("splunk_users#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/splunk_users").to route_to("splunk_users#create")
    end

    it "routes to #update" do
      expect(:put => "/splunk_users/1").to route_to("splunk_users#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/splunk_users/1").to route_to("splunk_users#destroy", :id => "1")
    end

  end
end
