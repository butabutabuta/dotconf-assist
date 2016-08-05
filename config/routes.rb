Rails.application.routes.draw do
  get 'register/new'

  get 'register/update'

  get 'register/create'

  get 'register/delete'

  get 'session/create'

  get 'session/new'

  devise_for :authentications, :controllers => {:registrations => "register", :sessions => "session"}

  get 'admin/home'

  get 'admin/accountlist'

  get 'admin/statistics_splunk_users'

  get 'admin/inputlist'

  get 'admin/generateconf'

  get 'users/home'

  get 'users/new'

  get 'users/confirm'

  get 'users/show'

  get 'splunk_users/listaccounts'

  get 'splunk_users/useraccounts'

  get 'admin/listaccounts'

  get 'admin/useraccounts'

  get 'admin/report'

  get 'admin/generateconf'

  get 'admin/cancelinputs'

  get 'admin/cancelaccounts'

  get 'admin/approveaccounts'

  get 'admin/approveinputs'

  get 'admin/list_request_accounts'

  get 'admin/statistics_portal_accounts'

  get 'admin/show_request_accounts'

  get 'admin/approve_request_accounts'

  get 'admin/cancel_request_accounts'

  get 'admin/getInputs'

  get 'admin/get_splunk_accounts'

  get 'splunk_users/setupinput'

  get 'splunk_users/test'

  get 'splunk_users/setupinputconfirm'

  get 'splunk_users/userinputs'

  get 'splunk_users/showscriptcontent/:inputid', to: 'splunk_users#showscriptcontent'

  get 'admin/showscriptcontent/:inputid', to: 'admin#showscriptcontent'

  get 'splunk_users/listinputs'

  get 'splunk_users/setupinputvalidateuser'

  get 'splunk_users/getprofile'

  get '/splunk_users/sendfeedback'

  get '/splunk_users/getAccountStatus'

  get '/splunk_users/getEnvironmentProfile'

  get '/splunk_users/updateEmailAddress'

  get '/splunk_users/get_announcements'

  get '/admin/show_prices'

  get '/admin/show_splunk_hosts'

  get '/admin/statistics_splunk_hosts'

  get '/admin/statistics_input_logs'

  get '/admin/get_announcements'

  get '/splunk_users/get_announcements_count'

  get '/splunk_users/manage_forwarders'

  get '/splunk_users/get_forwarders'

  get '/splunk_users/edit_forwarder'

  get '/splunk_users/delete_forwarder'

  get '/splunk_users/get_forwarders_count'

  get '/splunk_users/list_forwarders'

  get '/splunk_users/delete_inputs'

  get '/splunk_users/fetch_single_inputs'

  get '/splunk_users/get_server_classes'

  get '/splunk_users/list_forwarders_from_deployment_server'

  get '/splunk_users/get_server_class_forwarders'

  get '/splunk_users/get_server_class_clients'

  get '/splunk_users/get_apps'
 
  get '/splunk_users/get_inputs'

  get '/splunk_users/get_app_inputs'

  get '/splunk_users/get_app'

  get '/splunk_users/get_app_server_classes'

  get '/splunk_users/manage_deploy_requests'

  get '/splunk_users/get_size_and_storage' #for page url
  get '/splunk_users/get_log_size' #for ajaxcall
  get '/splunk_users/get_log_storage' #for ajaxcall

  get '/admin/test_get'

  get '/admin/manage_user_forwarders'

  get '/admin/get_user_forwarders'

  get '/admin/get_portal_users'

  get '/admin/get_portal_user_information'

  get '/admin/list_user_forwarders'

  get '/admin/report_inputs/:id', to: 'admin#report_inputs'

  get '/admin/show_user_apps'

  get '/admin/list_user_apps'

  get '/admin/report_apps/:id', to: 'admin#report_apps'

  get '/admin/display_request_account/:id', to: 'admin#display_request_account'

  get '/admin/report_splunk_account/:id', to: 'admin#report_splunk_account'

  get '/admin/get_tags'

  match '/admin/manage_prices', to: 'admin#manage_prices', via: [:get]

  match '/admin/add_price', to: 'admin#add_price', via: [:post]

  match '/admin/edit_price', to: 'admin#edit_price', via: [:post]

  match '/admin/delete_price', to: 'admin#delete_price', via: [:post]

  match '/admin/manage_splunk_hosts', to: 'admin#manage_splunk_hosts', via: [:get]

  match '/admin/add_splunk_host', to: 'admin#add_splunk_host', via: [:post]

  match '/admin/edit_splunk_host', to: 'admin#edit_splunk_host', via: [:post]

  match '/admin/delete_splunk_host', to: 'admin#delete_splunk_host', via: [:post]

  match '/admin/manage_announcements', to: 'admin#manage_announcements', via: [:get]

  match '/admin/add_announcement', to: 'admin#add_announcement', via: [:post]

  match '/admin/edit_announcement', to: 'admin#edit_announcement', via: [:post]

  match '/admin/delete_announcement', to: 'admin#delete_announcement', via: [:post]

  resources :input_logs
  resources :splunk_users, except: :show


  match 'splunk_users/test', to: 'splunk_users#test', via: [:post]
  match 'splunk_users/setupinput', to: 'splunk_users#setupinputpost', via: [:post]
  match 'splunk_users/setupinputconfirm', to: 'splunk_users#setupinputconfirm', via: [:post]
  match 'admin/report', to: 'admin#report', via: [:post]
  match '/splunk_users/display', to: 'splunk_users#display', via: [:post]
  match '/splunk_users/changePassword', to: 'splunk_users#changePassword', via: [:post]
  match '/splunk_users/add_forwarder', to: 'splunk_users#add_forwarder', via: [:post]
  match '/splunk_users/edit_forwarder', to: 'splunk_users#edit_forwarder', via: [:post]
  match '/splunk_users/delete_forwarder', to: 'splunk_users#delete_forwarder', via: [:post]
  match '/splunk_users/edit_inputs', to: 'splunk_users#edit_inputs', via: [:post]
  match '/splunk_users/add_server_class', to: 'splunk_users#add_server_class', via: [:post]
  match '/splunk_users/add_forwarder_from_deployment_server', to: 'splunk_users#add_forwarder_from_deployment_server', via: [:post]
  match '/splunk_users/edit_server_class', to: 'splunk_users#edit_server_class', via: [:post]
  match '/splunk_users/delete_server_class', to: 'splunk_users#delete_server_class', via: [:post]
  match '/splunk_users/add_app', to: 'splunk_users#add_app', via: [:post]
  match '/splunk_users/edit_app', to: 'splunk_users#edit_app', via: [:post]
  match '/splunk_users/add_deploy_setting', to: 'splunk_users#add_deploy_setting', via: [:post]
  match '/splunk_users/delete_app', to: 'splunk_users#delete_app', via: [:post]
  match '/splunk_users/validate_request_deploy_settings', to: 'splunk_users#validate_request_deploy_settings', via: [:post]
  match '/splunk_users/request_deploy_settings', to: 'splunk_users#request_deploy_settings', via: [:post]
  match '/splunk_users/request_stop_forwarding', to: 'splunk_users#request_stop_forwarding', via: [:post]
  match '/admin', to: 'admin#home', via: [:get]
  match 'admin/requestaccount', to:'admin#requestaccount', via:[:post]
  match '/admin/user_forwarders_suggest_change', to:'admin#user_forwarders_suggest_change', via: [:post]
  match '/admin/suggest_change_user_inputs', to:'admin#suggest_change_user_inputs', via: [:post]
  match '/admin/approve_user_app', to:'admin#approve_user_app', via: [:post]
  match '/admin/cancel_user_app', to:'admin#cancel_user_app', via: [:post]
  match '/admin/create_server_class', to:'admin#create_server_class', via: [:post]
  match '/admin/create_deployment_app', to:'admin#create_deployment_app', via: [:post]
  match '/admin/create_tag', to:'admin#create_tag', via: [:post]

##
# devise settings
##
  devise_scope :authentication do
     authenticated :authentication do
       root 'splunk_users#index', as: :authenticated_root
     end
     unauthenticated do
       root 'session#new', as: :unauthenticated_root
       get 'register/forgotPassword', to: 'register#forgotPassword'
       post 'register/resetPassword', to: 'register#resetPassword'
       get '/session/get_announcements'
     end
   end

  devise_scope :register do
  end
  match '/admin*other' => redirect('/admin/home'), via: :get
  match '*path' => redirect('/'), via: :get
end
