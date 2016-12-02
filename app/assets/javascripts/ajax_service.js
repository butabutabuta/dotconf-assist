var highlightEditedRow = false;
var highlightAddedRow = false;
var pageSpecificSearchBox;
$(document).keypress(function(e){
	if(e.which == 47) {
	$("#"+pageSpecificSearchBox).focus();
	}
});

function getThisData(for_this,from_this,in_this)
{
	if(for_this!='')
		in_this=in_this+for_this+"=";
	from_this="#"+from_this;
	in_this=in_this+ $(from_this).val();
	return(in_this);
}

/**
* Following Function is the ajaxCall()
* It makes the Ajax Calls required
* It uses the function that follow this functions
*/

function ajaxCall(whom)
{ 
	console.log(whom);
	data=getData(whom);
	address=getAddress(whom);
	type=getType(whom);
	$.ajax({
		 url: address,
		 type: type,
		 data: data,
		 success: function(data) {
				postData(whom,data);
		 },
		 error: function(data) {
				alert("Sorry the server is scheduled for maintenance");
				failPostData(whom,data);
		 }
	});
}


function getValue(str, key)
{
	var index = str.indexOf(key + "=");
	var index_end = str.indexOf("&", index);
	var res = str.substring(index + key.length + 1, index_end);
	return res
}

function ajaxCallScriptInput(whom,form){
	type=getType(whom);
	address=getAddress(whom);
	$form="";
	if (whom == "user_inputs_add") {
	$form = $("#add-input-form");
	}
	else if (whom == "user_inputs_edit"){
	$form = $("#edit-input-form");
	}
	var fd = new FormData($form[0]); //fd contains script file
	data=getData(whom);
	if (whom == "user_inputs_edit") {
	fd.append("log", getValue(data, "log"));
	}
	fd.append("env", getValue(data, "env"));
	fd.append("memo", getValue(data, "memo"));
	fd.append("os", getValue(data, "os"));
	fd.append("scriptname", getValue(data, "scriptname"));
	fd.append("option", getValue(data, "option"));
	fd.append("type", getValue(data, "type"));
	
	$.ajax({
	url: address,
	type: type,
	data: fd,
	cache: false,
	contentType: false,
	processData: false,
	success: function (data) {
		postData(whom,data);
	},
	error: function(data) {
		alert("Sorry the server is scheduled for maintenance");
		failPostData(whom,data);
	}
	});
}

function ajaxCallUnixAppInputForm(whom, env, name, intervalValue, periodValue, memo){
	type=getType(whom);
	address=getAddress(whom);
	data = "";
	if(whom == "user_inputs_edit"){
	data += "log=" + $("#input-inputs-edit-log").val() + "&"; //log id
	}

	data += "type=unixapp&";
	data += "env=" + env + "&";
	data += "scriptname=" + name + "&";
	data += "interval=" + intervalValue + "&";
	data += "data_retention_period=" + periodValue + "&";
	data += "memo=" + memo + "&";
	$.ajax({
		 url: address,
		 type: type,
		 data: data,
		 success: function(data) {
			postData(whom,data);
		 },
		 error: function(data) {
			alert("Sorry the server is scheduled for maintenance");
			failPostData(whom,data);
		 }
	});
}

/**
* Following is the getData()
*/
function getData(whom)
{ 
	var in_this="";
		if(whom=="useraccounts") {
		in_this="";
	}
	else if(whom=="userinputs") {
		in_this=getThisData("env","hidden-text-env",in_this);
	}
	if(whom=="adminuseraccounts") {
		in_this="";
	}
	else if(whom=="adminuserinputs") {
		in_this="";
	}
	else if(whom=="generateconf") {
		in_this="id="+$('#adminusersinputsgenerate').attr('value');
	}
	else if(whom=="adminusersinputscancel") {
		in_this=getThisData("id","adminusersinputscancel",in_this);
	}
	else if(whom=="adminusersaccountscancel") {
		in_this=getThisData("id","adminusersaccountscancel",in_this);
	}
	else if(whom=="adminusersaccountsapprove") {
		in_this=getThisData("id","adminusersaccountsapprove",in_this);
	}
	else if(whom=="adminusersinputsapprove") {
		in_this=getThisData("id","adminusersinputsapprove",in_this);
	}
	else if(whom=="setupinputvalidateuser") {
		in_this=getThisData("user",targetDisplayId,in_this);
	}
	else if(whom=="testingrest") {
		in_this=$('#testingrestdata').val();
	}
	else if(whom=="send_feedback") {
		in_this=getThisData('username','feedback-username',in_this);
		in_this+="&";
		in_this=getThisData('subject','feedback-subject',in_this);
		in_this+="&";
		in_this=getThisData('content','feedback-content',in_this);
		in_this+="&";
	}
	else if(whom=="list_request_accounts") {
		in_this='';
	}
	else if(whom=="approve_request_accounts") {
		in_this=getThisData('user','splunk-user-id',in_this);
	}
	else if(whom=="cancel_request_accounts") {
		in_this=getThisData('user','splunk-user-id',in_this);
	}
	else if(whom=="display_request_account") {
		in_this='';
	}
	else if(whom=="get_profile") {
		in_this=getThisData("env","hidden-text-env",in_this);
	}
	else if(whom=="change_password") {
		in_this=getThisData('oldpassword','input-text-password-change-old-password',in_this);
		in_this+="&";
		in_this=getThisData('newpassword','input-text-password-change-new-password',in_this);
	}
	else if(whom=="get_account_status") {
		in_this=getThisData('env','hidden-text-env',in_this);
	}
	else if(whom=="get_environment_profile") {
		in_this=getThisData('env','hidden-text-env',in_this);
	}
	else if(whom=="edit_email_address") {
		in_this=getThisData('email_emergency','input-text-email-edit-email-for-emergency',in_this);
		in_this+="&";
		in_this=getThisData('email','input-text-email-edit-email-id',in_this);
		in_this+="&";
		in_this=getThisData('appteamname','input-text-email-edit-app-team-name',in_this);
		in_this+="&";
		in_this=getThisData('groupname','input-text-email-edit-group-name',in_this);
		in_this+="&";
		in_this=getThisData('serviceid','input-text-email-edit-service-id',in_this);
	}
	else if(whom=="reset_password") {
		in_this=getThisData('user','user-name',in_this);
		in_this+="&";
		in_this=getThisData('email','email',in_this);
	}
	else if(whom=="reset_password_validate_user") {
		in_this=getThisData("user",targetDisplayId,in_this);
	}

	else if(whom=="price_add") {
		in_this=getThisData("service_unit_price","input-price-add-service_unit_price",in_this);
		in_this+="&";
		in_this=getThisData("storage_unit_price","input-price-add-storage_unit_price",in_this);
		in_this+="&";
	}
	else if(whom=="price_get") {
		in_this="";
	}
	else if(whom=="price_edit") {
		in_this=getThisData("price_id","input-price-edit-price_id",in_this);
		in_this+="&";
		in_this=getThisData("service_unit_price","input-price-edit-service_unit_price",in_this);
		in_this+="&";
		in_this=getThisData("storage_unit_price","input-price-edit-storage_unit_price",in_this);
		in_this+="&";
	}
	else if(whom=="price_delete") {
		in_this=getThisData("price_id","input-price-delete-price_id",in_this);
		in_this+="&";
	}

	else if(whom=="splunk_host_add") {
		in_this=getThisData("host_name","input-splunk-host-add-name",in_this);
		in_this+="&";
		in_this=getThisData("role","select-splunk-host-add-role",in_this);
		in_this+="&";
		in_this=getThisData("env","select-splunk-host-add-env",in_this);
	}
	else if(whom=="splunk_host_get") {
		in_this="";
	}
	else if(whom=="splunk_host_edit") {
		in_this=getThisData("host_name","input-splunk-host-edit-name",in_this);
		in_this+="&";
		in_this=getThisData("role","select-splunk-host-edit-role",in_this);
		in_this+="&";
		in_this=getThisData("host","input-splunk-host-edit-host",in_this);
		in_this+="&";
		in_this=getThisData("env","select-splunk-host-edit-env",in_this);
	}
	else if(whom=="splunk_host_delete") {
		in_this=getThisData("host_name","input-splunk-host-delete-name",in_this);
		in_this+="&";
		in_this=getThisData("role","select-splunk-host-delete-role",in_this);
		in_this+="&";
		in_this=getThisData("host","input-splunk-host-delete-host",in_this);
		in_this+="&";
		in_this=getThisData("env","select-splunk-host-delete-env",in_this);
	}
	else if(whom=="announcements_get") {
		in_this="";
	}
	else if(whom=="admin_announcements_get") {
		in_this="";
	}
	else if(whom=="announcement_add") {
		in_this=getThisData("announce","input-announcement-add-announce",in_this);
		in_this+="&";
		in_this=getThisData("status","select-announcement-add-status",in_this);
	}
	else if(whom=="announcement_edit") {
		in_this=getThisData("announce","input-announcement-edit-announce",in_this);
		in_this+="&";
		in_this=getThisData("announcement","input-announcement-edit-announcement",in_this);
		in_this+="&";
		in_this=getThisData("status","select-announcement-edit-status",in_this);
	}
	else if(whom=="announcement_delete") {
		in_this=getThisData("announce","input-announcement-delete-announce",in_this);
		in_this+="&";
		in_this=getThisData("announcement","input-announcement-delete-announcement",in_this);
		in_this+="&";
		in_this=getThisData("status","select-announcement-delete-status",in_this);
	}
	else if(whom=="admin_test_get") {
		in_this="";
	}
	else if(whom=="admin_get_portal_users") {
		in_this=getThisData("host","input-link-splunk-account-host",in_this);
	}
	else if(whom=="admin_get_portal_user_information") {
		in_this=getThisData("portal_user","select-link-splunk-account",in_this);
	}
	else if(whom=="announcements_count_get") {
		in_this="";
	}
	else if(whom=="splunk_host_statistics_get") {
		in_this="";
	}
	else if(whom=="portal_account_statistics_get") {
		in_this="";
	}
	else if(whom=="splunk_user_statistics_get") {
		in_this="";
	}
	else if(whom==getForwarders) {
		in_this=getThisData("env","hidden-text-env",in_this);
	}
	// else if(whom=="user_forwarder_add") {
	// 	in_this=getThisData("forwarder_name","input-forwarder-add-name",in_this);
	// 	in_this+="&";
	// 	in_this=getThisData("env","input-forwarder-add-forwarder-env",in_this);
	// }
	else if(whom=="user_forwarder_edit") {
		in_this=getThisData("forwarder_name","input-forwarder-edit-name",in_this);
		in_this+="&";
		in_this=getThisData("forwarder","input-forwarder-edit-forwarder",in_this);
	}
	else if(whom==deleteForwarder) {
		in_this=getThisData("forwarder","input-forwarder-delete-forwarder",in_this);
	}
	else if(whom==getForwarderCount) {
		in_this=getThisData("env","hidden-text-env",in_this);
	}
	else if(whom=="user_forwarders_list") {
		in_this=getThisData("env","hidden-text-env",in_this);
	}
	else if(whom=="admin_user_forwarders_list") {
		in_this="request_by=admin";
		in_this+="&";
		in_this=getThisData("input","input-report-inputs",in_this);
	}
	else if(whom=="user_inputs_add") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("data_retention_period","select-setup-inputs-add-log-retention-period",in_this);
		in_this+="&";
		in_this=getThisData("memo","input-setup-inputs-add-memo",in_this);
		in_this+="&";

		switch (inputType) {
			case "log":
			in_this+="type=log&";
			in_this=getThisData("log_file_path","input-setup-inputs-add-log-file-path",in_this);
			in_this+="&";
			in_this=getThisData("sourcetype","input-setup-inputs-add-source-type",in_this);
			in_this+="&";
			in_this=getThisData("log_file_size","select-setup-inputs-add-log-file-size",in_this);
			in_this+="&";
			in_this+="crcsalt=";
			if($("#select-setup-inputs-add-log-crcsalt").prop('checked')) 
			{
				in_this+="<SOURCE>";  //the literal　data will be saved in database
			}
			in_this+="&";
			in_this+="blacklist_files=";
			var custumized_files = $("#input-setup-inputs-add-blacklist-files").val();
			if (custumized_files != "") 
			{
				in_this += custumized_files;
			}
			else
			{
				 $checkedList = $(".add-input-blacklist :checkbox:checked");
				 if( $checkedList.length != 0 )
				 {
				 in_this += "\\.(";

				 $checkedList.each(function(index,elem)
				 {
					 var file = $(elem).attr('value');
					 in_this += file.substring(1,file.length)+"|";
				 });

				 in_this = in_this.substring(0,in_this.length-1); //delete the last "|"
				 in_this += ")$";
				 }
			}
			in_this+="&";
			break;

			case "script":
			in_this+="type=script&";
			in_this=getThisData("sourcetype","input-setup-inputs-add-source-type",in_this);
			in_this+="&";
			in_this=getThisData("log_file_size","select-setup-inputs-add-log-file-size",in_this);
			in_this+="&";
			in_this+="os=";
			unix = $("#add-input-nix-radio").is(":checked")
			if (unix == true) {
				in_this += "*nix";
			}else{
				in_this += "windows";
			}
			in_this+="&";
			in_this=getThisData("interval","input-setup-inputs-script-add-interval",in_this);
			in_this+="&";
			in_this+="scriptname=";
			in_this+=$('#input-setup-inputs-script-add-script').prop("files")[0]['name'];
			in_this+="&";
			in_this=getThisData("option","input-setup-inputs-script-add-option",in_this);
			in_this+="&"; //this line is must. due to string processing in getValue func of this file.
			break;

			case "unixapp": //set in ajaxCallUnixAppInputForm
			break;
		}
	}

	else if(whom=="user_inputs_edit") {
		in_this=getThisData("log","input-inputs-edit-log",in_this); //log id
		in_this+="&";
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("memo","input-setup-inputs-edit-memo",in_this);
		in_this+="&";
		in_this=getThisData("data_retention_period","select-setup-inputs-edit-log-retention-period",in_this);
		in_this+="&";
		switch (inputType) {
			case "log":
			in_this+="type=log&";
			in_this=getThisData("log_file_path","input-setup-inputs-edit-log-file-path",in_this);
			in_this+="&";
			in_this=getThisData("sourcetype","input-setup-inputs-edit-source-type",in_this);
			in_this+="&";
			in_this=getThisData("log_file_size","select-setup-inputs-edit-log-file-size",in_this);
			in_this+="&";
			in_this+="crcsalt=";
			if($("#select-setup-inputs-edit-log-crcsalt").prop('checked')) 
			{
				 in_this+="<SOURCE>";  //the literal　data will be saved in database
			}
			in_this+="&";
			in_this=getThisData("blacklist_files","input-setup-inputs-edit-blacklist-files",in_this); //need to confirm +=
			in_this+="&";
			break;
			case "script":
			in_this+="type=script&";
			in_this=getThisData("sourcetype","input-setup-inputs-edit-source-type",in_this);
			in_this+="&";
			in_this=getThisData("log_file_size","select-setup-inputs-edit-log-file-size",in_this);
			in_this+="&";
			in_this+="os=";
			unix = $("#edit-input-nix-radio").is(":checked");
			if (unix) {
				in_this += "*nix";
			}else{
				in_this += "windows";
			}
			in_this+="&";
			in_this=getThisData("interval","input-setup-inputs-edit-interval",in_this);
			in_this+="&";
			if ($('#input-setup-inputs-edit-script').prop("files").length == 0) { //no new file uploaded
				 in_this=getThisData("scriptname","input-setup-inputs-edit-scriptname",in_this);
			} 
			else{
				in_this+="scriptname=";
				in_this+=$('#input-setup-inputs-edit-script').prop("files")[0]['name'];
			}
			in_this+="&";
			in_this=getThisData("option","input-setup-inputs-edit-option",in_this);
			in_this+="&"; //this line is must. due to string processing in getValue func of this file.
			break;
			case "unixapp":
			break;
		}
	}

	else if(whom=="user_inputs_delete") {
		in_this=getThisData("log","input-inputs-delete-log",in_this);
	}
	else if(whom=="user_inputs_fetch_record") {
		in_this=getThisData("log","input-inputs-"+targetLogAction+"-log",in_this);
	}
	else if(whom=="input_logs_statistics_get") {
		in_this="";
	}
	else if(whom=="admin_user_forwarders_get") {
		in_this="";
	}
	else if(whom=="admin_user_forwarders_suggest_change") {
		in_this=getThisData("new_name","input-forwarder-suggest-change-new-name",in_this);
		in_this+="&";
		in_this=getThisData("old_name","input-forwarder-suggest-change-old-name",in_this);
		in_this+="&";
		in_this=getThisData("forwarder","input-forwarder-suggest-change-forwarder",in_this);
		in_this+="&";
	}
	else if(whom=="admin_user_inputs_suggest_change") {
		in_this=getThisData("new_log_file_path","input-setup-inputs-suggest-change-new-log-file-path",in_this);
		in_this+="&";
		in_this=getThisData("old_log_file_path","input-setup-inputs-suggest-change-old-log-file-path",in_this);
		in_this+="&";
		in_this=getThisData("new_source_type","input-setup-inputs-suggest-change-new-source-type",in_this);
		in_this+="&";
		in_this=getThisData("old_source_type","input-setup-inputs-suggest-change-old-source-type",in_this);
		in_this+="&";
		in_this=getThisData("new_log_file_size","select-setup-inputs-suggest-change-new-log-file-size",in_this);
		in_this+="&";
		in_this=getThisData("old_log_file_size","select-setup-inputs-suggest-change-old-log-file-size",in_this);
		in_this+="&";
		in_this=getThisData("new_log_retention_period","select-setup-inputs-suggest-change-new-log-retention-period",in_this);
		in_this+="&";
		in_this=getThisData("old_log_retention_period","select-setup-inputs-suggest-change-old-log-retention-period",in_this);
		in_this+="&";
		in_this=getThisData("new_memo","input-setup-inputs-suggest-change-new-memo",in_this);
		in_this+="&";
		in_this=getThisData("old_memo","input-setup-inputs-suggest-change-old-memo",in_this);
		in_this+="&";
		in_this=getThisData("input","input-report-inputs",in_this);
		in_this+="&";
	}
	else if(whom=="user_server_class_add") {
		in_this=getThisData("class_name","input-server-class-add-name",in_this);
		in_this+="&";
		in_this=getThisData("regex","input-server-class-add-regex",in_this);
		in_this+="&";
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("forwarders","input-server-class-add-forwarder-names",in_this);
	}
	else if(whom==getServerClasses) {
		in_this=getThisData("env","hidden-text-env",in_this);
	}
	else if(whom=="user_server_class_filter_get") {
		in_this=getThisData("env","hidden-text-env",in_this);
	}
	else if(whom==getForwardersFromDeploymentServer) {
		in_this=getThisData("env","hidden-text-env",in_this);
	}
	else if(whom=="user_forwarders_from_deployment_server_add") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("forwarders","input-forwarder-add-from-deployment-server-forwarder-names",in_this);
	}
	else if(whom==getForwardersFromServerClass) {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("server_class","input-server-class-show",in_this);
	}
	else if(whom=="user_server_class_edit_clients_get") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("server_class","input-server-class-edit",in_this);
	}
	else if(whom=="user_server_class_edit") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("server_class","input-server-class-edit",in_this);
		in_this+="&";
		in_this=getThisData("forwarders","input-server-class-edit-client-names",in_this);
		in_this+="&";
		in_this=getThisData("server_class_regex","input-server-class-edit-regex",in_this);
		in_this+="&";
		in_this=getThisData("server_class_name","input-server-class-edit-class-name",in_this);
		in_this+="&";
	}
	else if(whom=="user_server_class_delete") {
		in_this=getThisData("server_class","input-server-class-delete-server-class",in_this);
	}
	else if(whom=="user_apps_add") {
		in_this=getThisData("app_name","input-apps-add-name",in_this);
		in_this+="&";
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("inputs","input-apps-add-inputs",in_this);
		in_this+="&";
		in_this=getThisData("unixapp","hidden-text-unixapp",in_this);
	}
	else if(whom=="user_apps_get") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
	}
	else if(whom=="user_inputs_get") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
	}
	else if(whom=="user_app_edit_inputs_get") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("app","input-apps-edit-app",in_this);
		in_this+="&";
	}
	else if(whom=="user_apps_edit") {
		in_this=getThisData("app_name","input-apps-edit-name",in_this);
		in_this+="&";
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("inputs","input-apps-edit-inputs",in_this);
		in_this+="&";
		in_this=getThisData("app","input-apps-edit-app",in_this);
	}
	else if(whom=="user_app_get") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("app","input-apps-show-app",in_this);
		in_this+="&";
	}
	else if(whom=="user_app_server_class_get") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("app","input-apps-deploy-setting-app",in_this);
	}
	else if(whom=="user_apps_add_deploy_setting") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("app","input-apps-deploy-setting-app",in_this);
		in_this+="&";
		in_this=getThisData("server_classes","input-apps-deploy-setting-server-classes",in_this);
	}
	else if(whom=="user_apps_delete") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("app","input-apps-delete-app",in_this);
	}
	else if(whom=="user_deploy_requests_apps_get") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
	}
	else if(whom=="user_request_deploy_settings") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("app","input-apps-deploy-setting-request-send-app",in_this);
	}
	else if(whom=="admin_list_user_apps") {
	}

	else if(whom=="admin_approve_user_app_deploy_request") {
		in_this=getThisData("app","hidden-text-app",in_this);
		in_this+="&";
		in_this=getThisData("message_user","input-apps-deploy-approve-user-message",in_this);
		in_this+="&";
	}
	else if(whom=="admin_cancel_user_app_deploy_request") {
		in_this=getThisData("app","hidden-text-app",in_this);
		in_this+="&";
		in_this=getThisData("message_user","input-apps-deploy-cancel-user-message",in_this);
		in_this+="&";
	}
	else if(whom=="admin_server_class_create") {
		in_this=getThisData("classes","input-server-class-create-name",in_this);
		in_this+="&";
		in_this=getThisData("app","input-server-class-create-app",in_this);
		in_this+="&";
		in_this=getThisData("deploy_host","select-server-class-deploy-host",in_this);
		in_this+="&";
		in_this=getThisData("forwarders","input-server-class-create-forwarders",in_this);
		in_this+="&";
	}
	else if(whom=="user_validate_request_deploy_settings") {
		in_this=getThisData("app","hidden-text-app",in_this);
	}
	else if(whom=="user_request_stop_forwarding") {
		in_this=getThisData("app","hidden-text-app",in_this);
	}
	else if(whom=="admin_deployment_app_create") {
		in_this=getThisData("password","input-server-class-create-ssh-server-password",in_this);
		in_this+="&";
		in_this=getThisData("username","input-server-class-create-ssh-server-username",in_this);
		in_this+="&";
		in_this=getThisData("deploy_host","select-server-class-deploy-host",in_this);
		in_this+="&";
		in_this=getThisData("app_data","input-server-class-create-app-details",in_this);
		in_this+=$("#input-server-class-create-app-details").html();
		in_this+="&";
		in_this=getThisData("inputids","input-server-class-create-app-inputids-details",in_this);
		in_this+=$("#input-server-class-create-app-inputids-details").html();
		in_this+="&";
		in_this=getThisData("env","input-report-apps-app-env",in_this);
		in_this+="&";
	}
	else if(whom=="anonymous_announcements_get") {
		in_this="";
	}
	else if(whom=="admin_populate_tags_server_class_modal") {
		in_this=getThisData("search_host","select-server-class-search-host",in_this);
		in_this+="&";
		in_this=getThisData("user","label-report-apps-user-name",in_this);
		in_this+=$("#label-report-apps-user-name").html();
		in_this+="&";
	}
	else if(whom=="admin_tag_create") {
		if($("#input-server-class-create-search-tag").val()!="") {
			 in_this=getThisData("tag_name","input-server-class-create-search-tag",in_this);
			 in_this+="&";
		}
		else {
			 in_this=getThisData("tag_name","select-server-class-search-tags",in_this);
			 in_this+="&";
		}
		in_this=getThisData("search_host","select-server-class-search-host",in_this);
		in_this+="&";
		in_this=getThisData("host_names","input-server-class-create-search-tag-hosts",in_this);
		in_this+="&";
	}

	else if(whom=="user_log_size"){
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		month = $("#month-opt option:selected").attr("id");
		in_this += "month=" + month;
		in_this += "&";
	}

	else if(whom=="user_log_storage"){
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		month = $("#month-opt option:selected").attr("id");
		in_this += "month=" + month;
		in_this+="&";
	}
	return(in_this);
}

/**
* Following is the getAddress()
*/
function getAddress(whom)
{
	 var in_this="";
	 if(whom=="useraccounts") {
	 in_this="/splunk_users/useraccounts";
	 }
	 else if(whom=="userinputs") {
	 in_this="/splunk_users/userinputs";
	 }
	 if(whom=="adminuseraccounts") {
	 in_this="/admin/get_splunk_accounts";
	 }
	 else if(whom=="adminuserinputs") {
	 in_this="/admin/getInputs";
	 }
	 else if(whom=="generateconf") {
	 in_this="/admin/generateconf";
	 }
	 else if(whom=="adminusersinputscancel") {
	 in_this="/admin/cancelinputs";
	 }
	 else if(whom=="adminusersaccountscancel") {
	 in_this="/admin/cancelaccounts";
	 }
	 else if(whom=="adminusersaccountsapprove") {
	 in_this="/admin/approveaccounts";
	 }
	 else if(whom=="adminusersinputsapprove") {
	 in_this="/admin/approveinputs";
	 }
	 else if(whom=="setupinputvalidateuser") {
	 in_this="/splunk_users/setupinputvalidateuser";
	 }
	 else if(whom=="testingrest") {
	 in_this=$('#testingresturl').val();
	 }
	 else if(whom=="list_request_accounts") {
	 in_this="/admin/list_request_accounts";
	 }
	 else if(whom=="approve_request_accounts") {
	 in_this="/admin/approve_request_accounts";
	 }
	 else if(whom=="cancel_request_accounts") {
	 in_this="/admin/cancel_request_accounts";
	 }
	 else if(whom=="display_request_account") {
	 in_this="/admin/display_request_account";
	 }
	 else if(whom=="send_feedback") {
	 in_this="/splunk_users/sendfeedback";
	 }
	 else if(whom=="get_profile") {
	 in_this="/splunk_users/getprofile";
	 }
	 else if(whom=="change_password") {
	 in_this="/splunk_users/changePassword";
	 }
	 else if(whom=="get_account_status") {
	 in_this="/splunk_users/getAccountStatus";
	 }
	 else if(whom=="get_environment_profile") {
	 in_this="/splunk_users/getEnvironmentProfile";
	 }
	 else if(whom=="edit_email_address") {
	 in_this="/splunk_users/updateEmailAddress";
	 }
	 else if(whom=="reset_password") {
	 in_this="/register/resetPassword";
	 }
	 else if(whom=="reset_password_validate_user") {
	 in_this="/splunk_users/setupinputvalidateuser";
	 }
	 else if(whom=="price_add") {
	 in_this="/admin/add_price";
	 }
	 else if(whom=="price_get") {
	 in_this="/admin/show_prices";
	 }
	 else if(whom=="price_edit") {
	 in_this="/admin/edit_price";
	 }
	 else if(whom=="price_delete") {
	 in_this="/admin/delete_price";
	 }
	 else if(whom=="splunk_host_add") {
	 in_this="/admin/add_splunk_host";
	 }
	 else if(whom=="splunk_host_get") {
	 in_this="/admin/show_splunk_hosts";
	 }
	 else if(whom=="splunk_host_edit") {
	 in_this="/admin/edit_splunk_host";
	 }
	 else if(whom=="splunk_host_delete") {
	 in_this="/admin/delete_splunk_host";
	 }
	 else if(whom=="announcements_get") {
	 in_this="/splunk_users/get_announcements";
	 }
	 else if(whom=="admin_announcements_get") {
	 in_this="/admin/get_announcements";
	 }
	 else if(whom=="announcement_add") {
	 in_this="/admin/add_announcement";
	 }
	 else if(whom=="announcement_edit") {
	 in_this="/admin/edit_announcement";
	 }
	 else if(whom=="announcement_delete") {
	 in_this="/admin/delete_announcement";
	 }
	 else if(whom=="admin_test_get") {
	 in_this="/admin/test_get";
	 }
	 else if(whom=="admin_get_portal_users") {
	 in_this="/admin/get_portal_users";
	 }
	 else if(whom=="admin_get_portal_user_information") {
	 in_this="/admin/get_portal_user_information";
	 }
	 else if(whom=="announcements_count_get") {
	 in_this="/splunk_users/get_announcements_count";
	 }
	 else if(whom=="splunk_host_statistics_get") {
	 in_this="/admin/statistics_splunk_hosts";
	 }
	 else if(whom=="portal_account_statistics_get") {
	 in_this="/admin/statistics_portal_accounts";
	 }
	 else if(whom=="splunk_user_statistics_get") {
	 in_this="/admin/statistics_splunk_users";
	 }
	 else if(whom==getForwarders) {
	 in_this="/splunk_users/get_forwarders";
	 }
	 // else if(whom=="user_forwarder_add") {
	 // in_this="/splunk_users/add_forwarder";
	 // }
	 else if(whom=="user_forwarder_edit") {
	 in_this="/splunk_users/edit_forwarder";
	 }
	 else if(whom==deleteForwarder) {
	 in_this="/splunk_users/delete_forwarder";
	 }
	 else if(whom==getForwarderCount) {
	 in_this="/splunk_users/get_forwarders_count";
	 }
	 else if(whom=="user_forwarders_list") {
	 in_this="/splunk_users/list_forwarders";
	 }
	 else if(whom=="user_inputs_add") {
	 in_this="/splunk_users/setupinput";
	 }
	 else if(whom=="user_inputs_edit") {
	 in_this="/splunk_users/edit_inputs";
	 }
	 else if(whom=="user_inputs_delete") {
	 in_this="/splunk_users/delete_inputs";
	 }
	 else if(whom=="user_inputs_fetch_record") {
	 in_this="/splunk_users/fetch_single_inputs";
	 }
	 else if(whom=="input_logs_statistics_get") {
	 in_this="/admin/statistics_input_logs";
	 }
	 else if(whom=="admin_user_forwarders_get") {
	 in_this="/admin/get_user_forwarders";
	 }
	 else if(whom=="admin_user_forwarders_suggest_change") {
	 in_this="/admin/user_forwarders_suggest_change";
	 }
	 else if(whom=="admin_user_forwarders_list") {
	 in_this="/admin/list_user_forwarders";
	 }
	 else if(whom=="admin_user_inputs_suggest_change") {
	in_this="/admin/suggest_change_user_inputs";
	}
	else if(whom=="user_server_class_add") {
	in_this="/splunk_users/add_server_class";
	}
	else if(whom==getServerClasses) {
	in_this="/splunk_users/get_server_classes";
	}
	else if(whom=="user_server_class_filter_get") {
	in_this="/splunk_users/list_forwarders";
	}
	else if(whom==getForwardersFromDeploymentServer) {
	in_this = "/splunk_users/list_forwarders_from_deployment_server";
	}
	else if(whom=="user_forwarders_from_deployment_server_add") {
	in_this="/splunk_users/add_forwarder_from_deployment_server";
	}
	else if(whom==getForwardersFromServerClass) {
	in_this="/splunk_users/get_server_class_forwarders";
	}
	else if(whom=="user_server_class_edit_clients_get") {
	in_this="/splunk_users/get_server_class_clients";
	}
	else if(whom=="user_server_class_edit") {
	in_this="/splunk_users/edit_server_class";
	}
	else if(whom=="user_server_class_delete") {
	in_this="/splunk_users/delete_server_class";
	}
	else if(whom=="user_apps_add") {
	in_this="/splunk_users/add_app";
	}
	else if(whom=="user_apps_get") {
	in_this="/splunk_users/get_apps";
	}
	else if(whom=="user_inputs_get") {
	in_this="/splunk_users/get_inputs";
	}
	else if(whom=="user_app_edit_inputs_get") {
	in_this="/splunk_users/get_app_inputs";
	}
	else if(whom=="user_apps_edit") {
	in_this="/splunk_users/edit_app";
	}
	else if(whom=="user_app_get") {
	in_this="/splunk_users/get_app";
	}
	else if(whom=="user_app_server_class_get") {
	in_this="/splunk_users/get_app_server_classes";
	}
	else if(whom=="user_apps_add_deploy_setting") {
	in_this="/splunk_users/add_deploy_setting";
	}
	else if(whom=="user_apps_delete") {
	in_this="/splunk_users/delete_app";
	}
	else if(whom=="user_deploy_requests_apps_get") {
	in_this="/splunk_users/get_apps";
	}
	else if(whom=="user_request_deploy_settings") {
	in_this="/splunk_users/request_deploy_settings";
	}
	else if(whom=="admin_list_user_apps") {
	in_this = "/admin/list_user_apps";
	}
	else if(whom=="admin_approve_user_app_deploy_request") {
	in_this="/admin/approve_user_app";
	}
	else if(whom=="admin_cancel_user_app_deploy_request") {
	in_this="/admin/cancel_user_app";
	}
	else if(whom=="admin_server_class_create") {
	in_this="/admin/create_server_class";
	}
	else if(whom=="user_validate_request_deploy_settings") {
	in_this="/splunk_users/validate_request_deploy_settings";
	}
	else if(whom=="user_request_stop_forwarding") {
	in_this="/splunk_users/request_stop_forwarding";
	}
	else if(whom=="admin_deployment_app_create") {
	in_this="/admin/create_deployment_app";
	}
	else if(whom=="anonymous_announcements_get") {
	in_this="/session/get_announcements";
	}
	else if(whom=="admin_populate_tags_server_class_modal") {
	in_this="/admin/get_tags";
	}
	else if(whom=="admin_tag_create") {
	in_this="/admin/create_tag";
	}
	else if(whom=="user_log_size"){
		in_this+="/splunk_users/get_log_size";
	}
	else if(whom=="user_log_storage"){
		in_this+="/splunk_users/get_log_storage";
	}
	else if(whom=="") {
	}
	return(in_this);
}
/**
* Following is the getType()
*/
function getType(whom)
{
	 var in_this="";
	 if(whom=="useraccounts") {
	 in_this="get";
	 }
	 else if(whom=="userinputs") {
	 in_this="get";
	 }
	 if(whom=="adminuseraccounts") {
	 in_this="get";
	 }
	 else if(whom=="adminuserinputs") {
	 in_this="get";
	 }
	 else if(whom=="generateconf") {
	 in_this="get";
	 }
	 else if(whom=="adminusersinputscancel") {
	 in_this="get";
	 }
	 else if(whom=="adminusersaccountscancel") {
	 in_this="get";
	 }
	 else if(whom=="adminusersaccountsapprove") {
	 in_this="get";
	 }
	 else if(whom=="adminusersinputsapprove") {
	 in_this="get";
	 }
	 else if(whom=="setupinputvalidateuser") {
	 in_this="get";
	 }
	 else if(whom=="testingrest") {
	 in_this="post";
	 }
	 else if(whom=="send_feedback") {
	 in_this="get";
	 }
	 else if(whom=="list_request_accounts") {
	 in_this="get";
	 }
	 else if(whom=="approve_request_accounts") {
	 in_this="get";
	 }
	 else if(whom=="cancel_request_accounts") {
	 in_this="get";
	 }
	 else if(whom=="display_request_account") {
	 in_this="get";
	 }
	 else if(whom=="get_profile") {
	 in_this="get";
	 }
	 else if(whom=="change_password") {
	 in_this="post";
	 }
	 else if(whom=="get_account_status") {
	 in_this="get";
	 }
	 else if(whom=="get_environment_profile") {
	 in_this="get";
	 }
	 else if(whom=="edit_email_address") {
	 in_this="get";
	 }
	 else if(whom=="reset_password") {
	 in_this="post";
	 }
	 else if(whom=="reset_password_validate_user") {
	 in_this="get";
	 }
	  else if(whom=="price_add") {
	 in_this="post";
	 }
	 else if(whom=="price_get") {
	 in_this="get";
	 }
	 else if(whom=="price_edit") {
	 in_this="post";
	 }
	 else if(whom=="price_delete") {
	 in_this="post";
	 }
	 else if(whom=="splunk_host_add") {
	 in_this="post";
	 }
	 else if(whom=="splunk_host_get") {
	 in_this="get";
	 }
	 else if(whom=="splunk_host_edit") {
	 in_this="post";
	 }
	 else if(whom=="splunk_host_delete") {
	 in_this="post";
	 }
	 else if(whom=="announcements_get") {
	 in_this="get";
	 }
	 else if(whom=="admin_announcements_get") {
	 in_this="get";
	 }
	 else if(whom=="announcement_add") {
	 in_this="post";
	 }
	 else if(whom=="announcement_edit") {
	 in_this="post";
	 }
	 else if(whom=="announcement_delete") {
	 in_this="post";
	 }
	 else if(whom=="admin_test_get") {
	 in_this="get";
	 }
	 else if(whom=="admin_get_portal_users") {
	 in_this="get";
	 }
	 else if(whom=="admin_get_portal_user_information") {
	 in_this="get";
	 }
	 else if(whom=="announcements_count_get") {
	 in_this="get";
	 }
	 else if(whom=="splunk_host_statistics_get") {
	 in_this="get";
	 }
	 else if(whom=="portal_account_statistics_get") {
	 in_this="get";
	 }
	 else if(whom=="splunk_user_statistics_get") {
	 in_this="get";
	 }
	 else if(whom==getForwarders) {
	 in_this="get";
	 }
	 // else if(whom=="user_forwarder_add") {
	 // in_this="post";
	 // }
	 else if(whom=="user_forwarder_edit") {
	 in_this="post";
	 }
	 else if(whom==deleteForwarder) {
	 in_this="post";
	 }
	 else if(whom==getForwarderCount) {
	 in_this="get";
	 }
	 else if(whom=="user_forwarders_list") {
	 in_this="get";
	 }
	 else if(whom=="user_inputs_add") {
	 in_this="post";
	 }
	 else if(whom=="user_inputs_edit") {
	 in_this="post";
	 }
	 else if(whom=="user_inputs_delete") {
	 in_this="get";
	 }
	 else if(whom=="user_inputs_fetch_record") {
	 in_this="get";
	 }
	 else if(whom=="input_logs_statistics_get") {
	 in_this="get";
	 }
	 else if(whom=="admin_user_forwarders_get") {
	 in_this="get";
	 }
	 else if(whom=="admin_user_forwarders_suggest_change") {
	 in_this="post";
	 }
	 else if(whom=="admin_user_forwarders_list") {
	 in_this="get";
	 }
	 else if(whom=="admin_user_inputs_suggest_change") {
	 in_this="post";
	 }
	 else if(whom=="user_server_class_add") {
	 in_this="post";
	 }
	 else if(whom==getServerClasses) {
	 in_this="get";
	 }
	 else if(whom=="user_server_class_filter_get") {
	 in_this="get";
	 }
	 else if(whom==getForwardersFromDeploymentServer) {
	 in_this="get";
	 }
	 else if(whom=="user_forwarders_from_deployment_server_add") {
	 in_this="post";
	 }
	 else if(whom==getForwardersFromServerClass) {
	 in_this="get";
	 }
	 else if(whom=="user_server_class_edit_clients_get") {
	 in_this="get";
	 }
	 else if(whom=="user_server_class_edit") {
	 in_this="post";
	 }
	 else if(whom=="user_server_class_delete") {
	 in_this="post";
	 }
	 else if(whom=="user_apps_add") {
	 in_this="post";
	 }
	 else if(whom=="user_apps_get") {
	 in_this="get";
	 }
	 else if(whom=="user_inputs_get") {
	 in_this="get";
	 }
	 else if(whom=="user_app_edit_inputs_get") {
	 in_this="get";
	 }
	 else if(whom=="user_apps_edit") {
	 in_this="post";
	 }
	 else if(whom=="user_app_get") {
	 in_this="get";
	 }
	 else if(whom=="user_app_server_class_get") {
	 in_this="get";
	 }
	 else if(whom=="user_apps_add_deploy_setting") {
	 in_this="post";
	 }
	 else if(whom=="user_apps_delete") {
	 in_this="post";
	 }
	 else if(whom=="user_deploy_requests_apps_get") {
	 in_this="get";
	 }
	 else if(whom=="user_request_deploy_settings") {
	 in_this="post";
	 }
	 else if(whom=="admin_list_user_apps") {
	 in_this = "get";
	 }
	 else if(whom=="admin_approve_user_app_deploy_request") {
	 in_this="post";
	 }
	 else if(whom=="admin_cancel_user_app_deploy_request") {
	 in_this="post";
	 }
	 else if(whom=="admin_server_class_create") {
	 in_this="post";
	 }
	 else if(whom=="user_validate_request_deploy_settings") {
	 in_this="post";
	 }
	 else if(whom=="user_request_stop_forwarding") {
	 in_this="post";
	 }
	 else if(whom=="admin_deployment_app_create") {
	 in_this="post";
	 }
	 else if(whom=="anonymous_announcements_get") {
	 in_this="get";
	 }
	 else if(whom=="admin_populate_tags_server_class_modal") {
	 in_this="get";
	 }
	 else if(whom=="admin_tag_create") {
	 in_this = "post";
	 }
	 else if(whom=="user_log_size"){
	 	in_this ="get";
	 }
	 else if(whom=="user_log_storage"){
	 	in_this ="get";
	 }
	 else if(whom=="") {
	 }
	 return(in_this);
}