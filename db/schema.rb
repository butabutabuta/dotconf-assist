# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160804083456) do

  create_table "announcements", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "announce"
    t.integer  "status"
  end

  create_table "app_server_classes", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "apps", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "env"
    t.integer  "create_user_id"
    t.integer  "deploy_status"
    t.integer  "splunk_hosts_id"
    t.boolean  "unixapp"
  end

  add_index "apps", ["create_user_id"], name: "index_apps_on_create_user_id", using: :btree
  add_index "apps", ["splunk_hosts_id"], name: "index_apps_on_splunk_hosts_id", using: :btree

  create_table "authentications", force: true do |t|
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "splunk_user_name"
    t.integer  "create_user_id"
  end

  add_index "authentications", ["create_user_id"], name: "index_authentications_on_create_user_id", using: :btree
  add_index "authentications", ["reset_password_token"], name: "index_authentications_on_reset_password_token", unique: true, using: :btree

  create_table "create_users", force: true do |t|
    t.string   "email"
    t.string   "splunk_user_name"
    t.string   "password"
    t.string   "salt"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "status"
    t.string   "group_name"
    t.string   "app_team_name"
    t.integer  "serviceid"
    t.string   "email_for_emergency"
  end

  create_table "deploy_settings", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "app_id"
    t.integer  "server_class_id"
  end

  add_index "deploy_settings", ["app_id"], name: "index_deploy_settings_on_app_id", using: :btree
  add_index "deploy_settings", ["server_class_id"], name: "index_deploy_settings_on_server_class_id", using: :btree

  create_table "forwarders", force: true do |t|
    t.string   "name"
    t.string   "env"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "create_user_id"
  end

  add_index "forwarders", ["create_user_id"], name: "index_forwarders_on_create_user_id", using: :btree

  create_table "input_logs", force: true do |t|
    t.string   "log_file_path"
    t.string   "sourcetype"
    t.string   "log_file_size"
    t.string   "data_retention_period"
    t.text     "memo"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "status"
    t.integer  "splunk_users_id"
    t.integer  "app_id"
    t.string   "blacklist"
    t.string   "crcsalt"
    t.binary   "script",                limit: 16777215
    t.string   "os"
    t.string   "interval"
    t.string   "script_name"
    t.string   "option"
  end

  add_index "input_logs", ["app_id"], name: "index_input_logs_on_app_id", using: :btree
  add_index "input_logs", ["splunk_users_id"], name: "index_input_logs_on_splunk_users_id", using: :btree

  create_table "prices", force: true do |t|
    t.integer  "service_unit_price"
    t.integer  "storage_unit_price"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "server_class_forwarders", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "server_class_id"
    t.integer  "forwarder_id"
  end

  add_index "server_class_forwarders", ["forwarder_id"], name: "index_server_class_forwarders_on_forwarder_id", using: :btree
  add_index "server_class_forwarders", ["server_class_id"], name: "index_server_class_forwarders_on_server_class_id", using: :btree

  create_table "server_classes", force: true do |t|
    t.string   "name"
    t.string   "filter"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "create_user_id"
    t.string   "env"
    t.string   "regex"
  end

  add_index "server_classes", ["create_user_id"], name: "index_server_classes_on_create_user_id", using: :btree

  create_table "splunk_hosts", force: true do |t|
    t.string   "name"
    t.string   "role"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "env"
  end

  create_table "splunk_users", force: true do |t|
    t.text     "memo"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "rpaas_user_name"
    t.integer  "status"
    t.string   "email"
    t.string   "env"
    t.integer  "create_user_id"
    t.integer  "splunk_host_id"
  end

  add_index "splunk_users", ["create_user_id"], name: "index_splunk_users_on_create_user_id", using: :btree
  add_index "splunk_users", ["splunk_host_id"], name: "index_splunk_users_on_splunk_host_id", using: :btree

  create_table "user_uploaded_files", force: true do |t|
    t.string   "file_name"
    t.string   "file_type"
    t.string   "leofs_file_name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "splunk_users_id"
  end

  add_index "user_uploaded_files", ["splunk_users_id"], name: "index_user_uploaded_files_on_splunk_users_id", using: :btree

  create_table "versions", force: true do |t|
    t.integer  "version"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
