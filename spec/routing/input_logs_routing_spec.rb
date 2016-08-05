require "rails_helper"

RSpec.describe InputLogsController, :type => :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/input_logs").to route_to("input_logs#index")
    end

    it "routes to #new" do
      expect(:get => "/input_logs/new").to route_to("input_logs#new")
    end

    it "routes to #show" do
      expect(:get => "/input_logs/1").to route_to("input_logs#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/input_logs/1/edit").to route_to("input_logs#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/input_logs").to route_to("input_logs#create")
    end

    it "routes to #update" do
      expect(:put => "/input_logs/1").to route_to("input_logs#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/input_logs/1").to route_to("input_logs#destroy", :id => "1")
    end

  end
end
