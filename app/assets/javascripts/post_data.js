function getInputTableHeader(type, checkbox){
  var table = "";
  if (type == "log") 
  {
    table += "<thead><tr>";
    if(checkbox != null)
      table += checkbox;
    table += "<th style=\"width: 30%\">Log File Path</th>";
    table += "<th style=\"width: 10%\">Source Type</th>";
    table += "<th style=\"width: 15%\">Size Per Day</th>";
    table += "<th style=\"width: 15%\">Data Retention</th>";
    table += "<th style=\"width: 10%\">crcSalt</th>";
    table += "<th style=\"width: 10%\">Blacklist</th>";
    table += "<th style=\"width: 15%\">Other Specifications</th>";
    table += "</tr></thead>";
  }
  else if (type == "script"){
    table += "<thead><tr>";
    if(checkbox != null)
      table += checkbox;
    table += "<th style=\"width: 20%\">Script</th>";
    table += "<th style=\"width: 10%\">Source Type</th>";
    table += "<th style=\"width: 15%\">Size Per Day</th>";
    table += "<th style=\"width: 15%\">Data Retention</th>";
    table += "<th style=\"width: 10%\">Interval</th>";
    table += "<th style=\"width: 10%\">OS</th>";
    table += "<th style=\"width: 10%\">Option</th>";
    table += "<th style=\"width: 15%\">Other Specifications</th>";
    table += "</tr></thead>";
  }
  else if(type == "unixapp"){
    table += "<thead><tr>";
    if(checkbox != null)
      table += checkbox;
    table += "<th style=\"width: 20%\">Script</th>";
    table += "<th style=\"width: 15%\">Data Retention</th>";
    table += "<th style=\"width: 15%\">Interval</th>";
    table += "<th style=\"width: 50%\">Other Specifications</th>";
    table += "</tr></thead>";
  }
  return table;
}

function postData(whom,data)
{
  if(whom=="useraccounts") { //unused?
    var accountTable = "";
    accountTable += "<thead id=\"user-accounts-table-head\"> <tr id=\"user-accounts-table-row\">";
    accountTable += "<th style=\"width: 10%\" id=\"user-accounts-table-action\">Action</th>"; 
    accountTable += "<th style=\"width: 10%\">Status</th>";
    accountTable += "<th style=\"width: 10%\" id=\"user-accounts-table-account\">Account</th>"; 
    accountTable += "<th style=\"width: 10%\">Requested At</th>";
    accountTable += "</tr></thead>";
    jQuery.each(data, function(index, value) {
      var status="";
      if(value.status==0) {
        status="Requested";
      }
      else if(value.status==9) {
        status="Canceled";
      }
      else if(value.status==1) {
        status="Approved";
      }
      datte=value.created_at.substr(0,10);
      timme=value.created_at.substr(11,8);
      requestedat=datte+" "+timme;

      accountTable += "<tr>";
      accountTable += "<td class=\"user-accounts-table-details\"><form action=\"/splunk_users/display\" method=\"post\" onsubmit=\"callingthis(this)\"><input type=\"hidden\" name=\"user\" value=\""+value.user_name+"\"></input><button class=\"btn btn-info\" type=\"sumbit\">Details</button></form> </td>";
      accountTable += "<td>"+status+"</td>";
      accountTable += "<td>"+value.user_name+"</td>";
      accountTable += "<td>"+requestedat+"</td>";
      accountTable += "</tr>";
    });
    $("#user-accounts-table").append(accountTable);
  }

  else if(whom=="userinputs") {
    var logInputTable = "";
    var scriptInputTable = "";
    var unixappInputTable = "";
    var addUnixappInputTable = "";
    var commonHeader = "";
    commonHeader += "<th style=\"width: 10%\">Show</th>";
    commonHeader += "<th style=\"width: 10%\">Edit</th>";
    commonHeader += "<th style=\"width: 10%\">Delete</th>";
    commonHeader += "<th style=\"width: 10%\">Created At</th>";
    commonHeader += "</tr></thead>";

    logInputTable += "<thead id=\"user-inputs-table-head\"> <tr>";
    logInputTable += "<th style=\"width: 20%\">Log File Path</th>";
    logInputTable += commonHeader;

    scriptInputTable += "<thead id=\"user-inputs-table-head\"> <tr>";
    scriptInputTable += "<th style=\"width: 20%\">Script File Name</th>";
    scriptInputTable += commonHeader;

    unixappInputTable += "<thead id=\"user-inputs-table-head\"> <tr>";
    unixappInputTable += "<th style=\"width: 20%\">Unix App Script Name</th>";
    unixappInputTable += commonHeader;

    addUnixappInputTable += "<thead id=\"modal-add-unixapp-input-table-head\"><tr>";
    addUnixappInputTable += "<th style=\"width: 5%\"></th>";
    addUnixappInputTable += "<th style=\"width: 25%\">Script Name</th>";
    addUnixappInputTable += "<th style=\"width: 35%\">Interval</th>";
    addUnixappInputTable += "<th style=\"width: 35%\">Data Retention Period</th>";
    addUnixappInputTable += "</tr></thead>";
    
    if (data.length == 0 ) {
      displayNoticeElement( "notice-manage-inputs", "No Data Available Currently. Please Input Some Data First." );
    }

    jQuery.each(data, function(index, value) {
      var first_column;
      var type = 0;
      if (value.log_file_path != null) { //log
        first_column = value.log_file_path;
      }
      else if (value.os != null){ //script
        first_column = value.script_name;
        type = 1;
      }
      else if (value.script_name != null){ //unix app
        first_column = value.script_name;
        type = 2;
      }

      datte=value.created_at.substr(0,10);
      timme=value.created_at.substr(11,8);
      requestedat=datte+" "+timme;

      var editCell = "";
      var deleteCell = "";
      var commonInputTable = "";


      if(value.status == 0){ //requested or not requested
        editCell= "<td> <button type=\"button\" onclick=\"openModalInputsEdit("+value.id+","+index+","+type+")\" class=\"btn btn-primary\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i>Edit</button> </td>";
        deleteCell= "<td> <button type=\"button\" onclick=\"openModalInputsDelete("+value.id+","+index+")\" class=\"btn btn-danger\" ><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i>Delete</button> </td>";
      }else if(value.status == 9 || value.status == 1){ //canceled or approved
        editCell = "<td><a data-placement=\"right\" data-toggle=\"tooltip\" title=\"Configured in App: " +value.memo + "\">Not Available</a></td>";
      }

      if (value.app_id != null) {
        deleteCell = "<td><a data-placement=\"right\" data-toggle=\"tooltip\" title=\"Configured in App: " +value.memo + "\">Not Available</a></td>";
      }

      commonInputTable += "<tr name=\""+value.id+"\" id=\"user-inputs-table-row-"+index+"\">";
      commonInputTable += "<td style=\"word-break: break-all; width: 30%\" class=\"user-inputs-table-hostname\" id=\"user-inputs-"+index+"-hostname\">"+first_column+"</td>";
      commonInputTable += "<td class=\"user-inputs-table-show\" id=\"user-inputs-"+index+"-show\"><button type=\"button\" onclick=\"openModalInputsDetails("+value.id+","+index+","+type+")\" class =\"btn btn-info\"><i class=\"fa fa-list\" aria-hidden=\"true\"></i>Show</button> </td>";
      commonInputTable += editCell;
      commonInputTable += deleteCell;
      commonInputTable += "<td class=\"user-inputs-table-requestedat\" id=\"user-inputs-"+index+"-requestedat\"> "+requestedat+"</td>";
      commonInputTable += "</tr>";

      if(type == 0) //log
        logInputTable += commonInputTable;
      else if (type == 1)
        scriptInputTable += commonInputTable;
      else if (type == 2)
        unixappInputTable += commonInputTable;
    });
   
    var scripts = ["cpu","df","vmstat","iostat","interfaces","common","hardware","lastlog","lsof","netstat","netstat2","openPorts","openPortsEnhanced","package","passwd","protocol","ps","rlog","selinuxChecker","service","setup","sshdChecker","time","top","update","uptime","usersWithLoginPrivs","version","vsftpdChecker","who"];

    for(var i = 0; i < scripts.length; i++){
      addUnixappInputTable += "<tr>";
      addUnixappInputTable += "<td><input type=\"checkbox\" value=\""+scripts[i]+ "\" id=\"input-setup-inputs-add-" + scripts[i] + "\"></td>";
      addUnixappInputTable += "<td>"+scripts[i]+".sh</td>";
      addUnixappInputTable += "<td><input type=\"text\" id=\"input-setup-inputs-add-" + scripts[i] + "-interval\" placeholder=\"<number in seconds>or<cron>\"class=\"modal-input-short\">*</td>";
      addUnixappInputTable += "<td><select id=\"select-setup-inputs-add-" + scripts[i] + "-retention-period\" class=\"modal-input-short\">";
      addUnixappInputTable += "<option>1 Day</option>";
      addUnixappInputTable += "<option>2 Day</option>";
      addUnixappInputTable += "<option>3 Day</option>";
      addUnixappInputTable += "<option>1 Week</option>";
      addUnixappInputTable += "<option>2 Week</option>";
      addUnixappInputTable += "<option>3 Week</option>";
      addUnixappInputTable += "<option selected>1 Month</option>";
      addUnixappInputTable += "<option>3 Month</option>";
      addUnixappInputTable += "<option>6 Month</option>";
      addUnixappInputTable += "<option>1 Year</option>";
      addUnixappInputTable += "<option>3 Year</option>";
      addUnixappInputTable += "<option>6 Year</option>";
      addUnixappInputTable += "</select>*</td>";
      addUnixappInputTable += "</tr>";
    }

    $("#user-inputs-table").append(logInputTable);
    $("#user-inputs-script-table").append(scriptInputTable);
    $("#user-inputs-unixapp-table").append(unixappInputTable);
    $("#modal-add-unixapp-input-table").append(addUnixappInputTable);
    targetTableRow= "user-inputs-table-row-";
    getAllInputsList();

    //below is to change row color
    if (highlightEditedRow)
    {
      setColorForRow("user-inputs-table", "input-inputs-edit-log");
      setColorForRow("user-inputs-script-table", "input-inputs-edit-log");
      setColorForRow("user-inputs-unixapp-table", "input-inputs-edit-log");
      highlightEditedRow = false;
    }

    if (highlightAddedRow){
      setColorForRow("user-inputs-table", "input-add"); //second param not exist, need to handle it in setColorForRow function
      highlightAddedRow = false;
    }
    $('[data-toggle="tooltip"]').tooltip();
  }

  else if(whom=="adminuseraccounts") {
    $("#admin-accounts-table").append("<thead id=\"user-accounts-table-head\"> <tr id=\"user-accounts-table-row\"> <th style=\"width: 10%\" id=\"user-accounts-table-action\">Action</th> <th style=\"width: 10%\">Status</th><th style=\"width: 10%\" id=\"user-accounts-table-account\">Account</th> <th style=\"width: 10%\">Environment</th><th style=\"width: 10%\">Requested At</th></thead>");
    jQuery.each(data, function(index, value) {
      var status="";
      var env="";
      if(value.status==0) {
         status="Requested";
      }
      else if(value.status==9) {
         status="Canceled";
      }
      else if(value.status==1) {
         status="Approved";
      }
      if(value.env=="prod") {
         env="Production";
      }
      else if(value.env=="dev") {
         env="Development";
      }
      else if(value.env=="stg") {
         env="Staging";
      }
      datte=value.created_at.substr(0,10);
      timme=value.created_at.substr(11,8);
      requestedat=datte+" "+timme;
      $("#admin-accounts-table").append("<tr id=\"admin-accounts-table-row-"+index+"\"><td class=\"user-accounts-table-details\"> <button class=\"user-accounts-table-details-button btn btn-info\" onclick=\"location.href=\'/admin/report_splunk_account/"+value.id+"\'\" >Details</button></td> <td class=\"user-accounts-table-status\" id=\"admin-accounts-"+index+"-status\"> "+status+"  </td><td class=\"user-accounts-table-account\" id=\"admin-accounts-"+index+"-splunk-account\"> "+value.rpaas_user_name+"</td><td class=\"user-accounts-table-environment\" id=\"admin-accounts-"+index+"-env\"> "+env+"</td> </td><td class=\"user-accounts-table-requestedat\"> "+requestedat+"</td></tr>");
    });
  getAllSplunkAccountsList();
  }

  else if(whom=="adminuserinputs") {
    var logInputTable = "";
    var scriptInputTable = "";
    var unixappInputTable = "";
    var commonHeader = "";

    commonHeader += "<th style=\"width: 15%\">Status</th>";
    commonHeader += "<th style=\"width: 15%\">Account</th>";
    commonHeader += "<th style=\"width: 15%\">Requested At</th>";
    commonHeader += "<th style=\"width: 15%\">Action</th>";
    commonHeader += "</tr></thead>";

    logInputTable += "<thead><tr>";
    logInputTable += "<th style=\"width: 40%\">Log File Path</th>";
    logInputTable += commonHeader;

    scriptInputTable += "<thead><tr>";
    scriptInputTable += "<th style=\"width: 40%\">Script File Name</th>";
    scriptInputTable += commonHeader;

    unixappInputTable += "<thead><tr>";
    unixappInputTable += "<th style=\"width: 40%\">Unix App Input Name</th>";
    unixappInputTable += commonHeader;

    jQuery.each(data, function(index, value) {
      var status="";
      if(value.status==0) {
         status="Requested";
      }
      else if(value.status==9) {
         status="Canceled";
      }
      else if(value.status==1) {
         status="Approved";
      }
      datte=value.created_at.substr(0,10);
      timme=value.created_at.substr(11,8);
      requestedat=datte+" "+timme;

      var pathOrName = "";
      if(value.log_file_path != null){
        pathOrScriptName = value.log_file_path;
      }else{
        pathOrScriptName = value.script_name;
      }

      var commonInputTable = "";
      commonInputTable += "<tr id=\"admin-inputs-table-row-"+index+"\">";
      commonInputTable += "<td style=\"word-break: break-all; width: 40%\">"+pathOrScriptName+"</td>";
      commonInputTable += "<td>"+status+"</td>";
      commonInputTable += "<td>"+value.memo+"</td>";
      commonInputTable += "<td>"+requestedat+"</td>";
      commonInputTable += "<td><form action=\"/admin/report_inputs/"+value.id+"\" method=\"get\"><button class=\"btn btn-info\">Details</button></form></td>";
      commonInputTable += "</tr>";

      if (value.log_file_path != null)//log
        logInputTable += commonInputTable;
      else if(value.os != null)//script
        scriptInputTable += commonInputTable;
      else if(value.script_name != null)
        unixappInputTable += commonInputTable;
    });
    $("#admin-inputs-table").append(logInputTable);
    $("#admin-inputs-script-table").append(scriptInputTable);
    $("#admin-inputs-unixapp-table").append(unixappInputTable);

    targetTableRow = "admin-inputs-table-row-";
    getAllInputsList();
  }

   else if(whom=="generateconf") {
   document.getElementById("generatedinputconf").style.display = "block";
   $("#generatedinputconf").html(data);
   }
   else if(whom=="adminusersaccountscancel") {
   $('#user-account-wait').css("display","none");
   document.getElementById("adminusersaccountscancel").style.display = "none";
   document.getElementById("adminusersaccountsapprove").style.display = "none";
   $('#user-account-cancel').css("display","block");
   }
   else if(whom=="adminusersaccountsapprove") {
   $('#user-account-wait').css("display","none");
   document.getElementById("adminusersaccountscancel").style.display = "none";
   document.getElementById("adminusersaccountsapprove").style.display = "none";
   $('#user-account-approve').css("display","block");
   }
   else if(whom=="adminusersinputscancel") {
   $('#inputs-account-wait').css("display","none");
   document.getElementById("adminusersinputscancel").style.display = "none";
   document.getElementById("adminusersinputsapprove").style.display = "none";
   $('#inputs-account-cancel').css("display","block");
   }
   else if(whom=="adminusersinputsapprove") {
   $('#inputs-account-wait').css("display","none");
   document.getElementById("adminusersinputscancel").style.display = "none";
   document.getElementById("adminusersinputsapprove").style.display = "none";
   $('#inputs-account-approve').css("display","block");
   }
   else if(whom=="setupinputvalidateuser") {
   if(data=="yes")
   {
    //displayMessages("username","account-name","data-content",-400);
    //$('#account-name').popover("show");
    resultcount-=1;
    text1=0;
    displayMessages(targetDisplayType,targetDisplayId,"data-content",-400);
    $('#'+targetDisplayId).popover("show");
    $("#"+targetDisplayId).focus();
    $("#"+targetActionId).attr("disabled", true);
   }
   else
   {
    $("#"+targetActionId).attr("disabled", false);
   }
   }
   else if(whom=="send_feedback") {
      $('#notice-home').html("Sent feedback successfully !!");
    $('#notice-home').css("display","block");
    alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   $('#modal-feedback').modal('toggle');
   }
   else if(whom=="list_request_accounts") {
   $("#request-accounts-table").append("<thead id=\"request-accounts-table-head\"> <tr id=\"request-accounts-table-row\"> <th style=\"width: 10%\" id=\"request-accounts-table-action\">Action</th> <th style=\"width: 10%\">Status</th><th style=\"width: 10%\" id=\"request-accounts-table-account\">User</th> <th style=\"width: 10%\">Requested At</th></thead>");
   jQuery.each(data, function(index, value) {
    var status="";
    if(value.status==0) {
       status="Requested";
    }
    else if(value.status==9) {
       status="Canceled";
    }
    else{
       status="Approved";
    }
    $("#request-accounts-table").append("<tr id=\"admin-request-accounts-table-row-"+index+"\"><td class=\"request-accounts-table-details\"><button class=\"request-accounts-table-details-button btn btn-info\" onclick=\"location.href=\'/admin/display_request_account/"+value.id+"\'\">Details</button></td> <td class=\"request-accounts-table-status\" id=\"admin-request-accounts-"+index+"-status\"> "+status+"  </td><td class=\"request-accounts-table-account\" id=\"admin-request-accounts-"+index+"-account\"> "+value.splunk_user_name+"  </td><td class=\"request-accounts-table-requestedat\"> "+value.created_at+"</td></tr>");
   });
   getAllRequestAccountsList();
   }
   else if(whom=="approve_request_accounts") {
    $('#request-account-approve').css("display","block");
    $('#approve-request-accounts-button').css("display","none");
    $('#cancel-request-accounts-button').css("display","none");
   }
   else if(whom=="cancel_request_accounts") {
    $('#request-account-cancel').css("display","block");
    $('#approve-request-accounts-button').css("display","none");
    $('#cancel-request-accounts-button').css("display","none");
   }
   else if(whom=="display_request_account") {
   }
   else if(whom=="get_profile") {
    if(data!=null)
    {
    if(data.splunk_user_name!=null) {
     $("#tab-profile-user-name").html(data.splunk_user_name);
    }
    else {
     $("#tab-profile-user-name").html("Not Specifed");
    }
    if(data.group_name!=null) {
    $("#tab-profile-group-name").html(data.group_name);
    }
    else {
    $("#tab-profile-group-name").html("Not Specifed");
    }
    if(data.app_team_name!=null) {
    $("#tab-profile-app-team-name").html(data.app_team_name);
    }
    else {
    $("#tab-profile-app-team-name").html("Not Specifed");
    }
    if(data.serviceid!=null) {
    $("#tab-profile-service-id").html(data.serviceid);
    }
    else {
    $("#tab-profile-service-id").html("Not Specifed");
    }
    if(data.email!=null) {
    $("#tab-profile-email-id").html(data.email);
    }
    else {
    $("#tab-profile-email-id").html("Not Specifed");
    }
    if(data.email_for_emergency!=null) {
    $("#tab-profile-email-for-emergency").html(data.email_for_emergency);
    }
    else {
    $("#tab-profile-email-for-emergency").html("Not Specifed");
    }
    }

    else
    {
    $("#h1-page-heading").html("Account Not Created Yet for "+$("#hidden-text-env").val());
    $("#tab-profile-user-name").html("Not Created");
    $("#tab-profile-group-name").html("Not Created");
    $("#tab-profile-app-team-name").html("Not Created");
    $("#tab-profile-service-id").html("Not Created");
    $("#tab-profile-memo").html("Not Created");
    $("#tab-profile-rpaas-user-name").html("Not Created");
    $("#tab-profile-environment").html("Not Created");
    $("#tab-profile-email").html("Not Created");
    $("#tab-profile-status").html("Not Created");
    }
   }
   else if(whom=="change_password") {
    $('#notice-home').html(data);
    $('#notice-home').css("display","block");
    alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
    $('#modal-password-change').modal('toggle');
    window.location.href="/";
   }
   else if(whom=="get_account_status") {
    removeThisElementChildren("#div-sidebar-extra");
    if(data=="0") {
    $("#div-sidebar-extra").prepend("<img id=\"img-sidebar-workflow\" src=\"/assets/workflow-1.jpg\" />");
    }
    else if(data=="100") {
    $("#div-sidebar-extra").prepend("<img id=\"img-sidebar-workflow\" src=\"/assets/workflow-account-created.jpg\" />");
    }
    else if(data=="110") {
    $("#div-sidebar-extra").prepend("<img id=\"img-sidebar-workflow\" src=\"/assets/workflow-input-setup.jpg\" />");
    }
    else if(data=="111") {
    $("#div-sidebar-extra").prepend("<img id=\"img-sidebar-workflow\" src=\"/assets/workflow-upload.jpg\" />");
    }
   }
   else if(whom=="get_environment_profile") {
    removeThisElementChildren("#div-sidebar-extra");
    //$("#div-sidebar-extra").prepend("<h4>Account Information</h4>");
    var fields=["rpaas_user_name"];
    var url="";
    var i=0;
    if(data!=null) {
    jQuery.each(data, function(index, value) {
      if(index=="status") {
      if(value=="0") {
        value="Requested";
      }
      else if(value=="1") {
        value="Accepted";
      }
      else if(value=="9") {
        value="Rejected";
        env=$("#hidden-text-env").val();
        $("#button-" + env +"-input-create").attr("disabled","disabled");
        $("#button-" + env +"-upload").attr("disabled","disabled");
        $("#button-" + env +"-upload-list").attr("disabled","disabled");
        $("#button-" + env +"-input-list").attr("disabled","disabled");
      }
      }
      if((value!="") && (value!=null)) {
      jQuery.each(fields,function(indx, vale) {
         if(vale==index) {
        $("#div-sidebar-extra").append("<p>" + vale+ ": " + value +  "<br></p>");
         }
      });
      i=i+1;
      }
      if(index=="env")
      {
      url=value;
      // $("#div-sidebar-extra").append("<p>Splunk Host⬇️</p>");
      }
    });
    url="http://"+url+"/";
    $("#div-sidebar-extra").append("Splunk Host: <a href=\" " + url + " \" target=\"_blank\"> "+ url + " </a><br>");
    }
    // else {
    //   $("#div-sidebar-extra").append("<p> Please Create an Account<br></p><br>");
    // }
   }
   else if(whom=="edit_email_address") {
    //$('#button-tab-profile-edit-email').remove();
    $('#alert-modal-email-edit-confirm').css("display","none");
    $('#notice-home').html("Profile Updated Successfully !!");
    $('#notice-home').css("display","block");
    alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
    ajaxCall("get_profile");
   }
   else if(whom=="reset_password_validate_user") {
   if(data=="no")
   {
    resultcount-=1;
    text1=0;
    displayMessages(targetDisplayType,targetDisplayId,"data-content",-401);
    $('#'+targetDisplayId).popover("show");
    $("#"+targetDisplayId).focus();
    $("#"+targetActionId).attr("disabled", true);
   }
   else
   {
    $("#"+targetActionId).attr("disabled", false);
   }
   }

    else if (whom=="price_add"){
      removeThisElementChildren("#admin-prices-table");
      $('#notice-manage-prices').html(data);
      $('#notice-manage-prices').css("display","block");
      alertNoticesTimeoutVar = clearAlertNotices();
      if (alertNoticesTimeoutVar != -1) {
        clearTimeout(alertNoticesTimeoutVar);
        alertNoticesTimeoutVar = clearAlertNotices();
      }
      $('#modal-price-add').modal('toggle');
      ajaxCall('price_get');
    }

    else if (whom=="price_get"){
      var priceTable = "";
      priceTable += "<thead><tr>";
      priceTable += "<th>Service Unit Price (Yen / GB Monthly)</th>";
      priceTable += "<th>Storage Unit Price (Yen / GB Monthly)</th>";
      priceTable += "<th>Edit</th>";
      priceTable += "<th>Delete</th>";
      priceTable += "</tr></thead>";

      jQuery.each(data, function(index, value) {
        priceTable += "<tr>";
        priceTable += "<td id=admin-price-"+index+"-service_unit_price>" + value.service_unit_price + "</td>";
        priceTable += "<td id=admin-price-"+index+"-storage_unit_price>" + value.storage_unit_price + "</td>";
        priceTable += "<td> <button class=\"btn btn-primary\" onclick=\"openModalPriceEdit("+index+","+ value.id +")\" ><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i>Edit</button></td>";
        priceTable += "<td> <button class=\"btn btn-danger\" onclick=\"openModalPriceDelete("+index+","+ value.id +")\" ><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i>Delete</button></td>";
        priceTable += "</tr>";
      });
      $("#admin-prices-table").append(priceTable);
    }

    else if (whom=="price_edit"){
      removeThisElementChildren("#admin-prices-table");
      $('#notice-manage-prices').html(data);
      $('#notice-manage-prices').css("display","block");
      alertNoticesTimeoutVar = clearAlertNotices();
      if (alertNoticesTimeoutVar != -1) {
        clearTimeout(alertNoticesTimeoutVar);
        alertNoticesTimeoutVar = clearAlertNotices();
      }
      $('#modal-price-edit').modal('toggle');
      ajaxCall('price_get');
    }

    else if (whom=="price_delete"){
      removeThisElementChildren("#admin-prices-table");
      $('#notice-manage-prices').html(data);
      $('#notice-manage-prices').css("display","block");
      alertNoticesTimeoutVar = clearAlertNotices();
      if (alertNoticesTimeoutVar != -1) {
        clearTimeout(alertNoticesTimeoutVar);
        alertNoticesTimeoutVar = clearAlertNotices();
      }
      $('#modal-price-delete').modal('toggle');
      ajaxCall('price_get');
    }

   else if(whom=="splunk_host_add") {
   $('#notice-manage-splunk-hosts').html(data);
   $('#notice-manage-splunk-hosts').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   child=$("tbody").children();
   name=$('#input-splunk-host-add-name').val();
   role=$('#select-splunk-host-add-role').val();
   env=$('#select-splunk-host-add-env').val();
   if (child.length==0) {
     $('thead').append("<tr> <td class=\"admin-hosts-table-name\">"+ name +"</td><td class=\"admin-hosts-table-env\">"+ env +"</td><td class=\"admin-hosts-table-role\">"+ role +"</td><td>Available on Refresh</td><td>Available on Refresh</td> </tr>");
   }
   else {
     $(child[0]).before("<tr> <td class=\"admin-hosts-table-name\">"+ name +"</td><td class=\"admin-hosts-table-env\">"+ env +"</td><td class=\"admin-hosts-table-role\">"+ role +"</td> <td>Available on Refresh</td><td>Available on Refresh</td> </tr>");
   }
   $('#modal-splunk-host-add').modal('toggle');
   }
   else if(whom=="splunk_host_get") {
   $("#admin-hosts-table").append("<thead id=\"admin-hosts-table-head\"> <tr id=\"admin-hosts-table-row\"> <th style=\"width: 10%\" id=\"admin-hosts-table-action\">Name</th> <th style=\"width: 10%\" id=\"admin-hosts-table-env\">Environment</th> <th style=\"width: 10%\" id=\"admin-hosts-table-action\">Role</th> <th style=\"width: 10%\" id=\"admin-hosts-table-edit\">Edit</th><th style=\"width: 10%\" id=\"admin-hosts-table-delete\">Delete</th></thead>");
   jQuery.each(data, function(index, value) {
    $("#admin-hosts-table").append("<tr id=\"admin-hosts-table-row-"+index+"\" > <td class=\"admin-hosts-table-name\" id=\"admin-host-"+index+"-name\">"+ value.name +"</td><td class=\"admin-hosts-table-env\" id=\"admin-host-"+index+"-env\">"+ value.env +"</td><td class=\"admin-hosts-table-role\" id=\"admin-host-"+index+"-role\">"+ value.role +"</td> <td> <button type=\"button\" onclick=\"openModalSplunkHostEdit("+index+","+ value.id +")\" class=\"btn btn-primary\" id=\"button-splunk-host-edit-"+index+"\">Edit</button> </td> <td> <button type=\"button\" class=\"btn btn-danger\" id=\"button-splunk-host-delete-"+index+"\" onclick=\"openModalSplunkHostDelete("+index+","+ value.id +")\" >Delete</button> </td></tr>");
   });
   getAllSplunkHostsList();
   }
   else if(whom=="splunk_host_edit") {
   $('#notice-manage-splunk-hosts').html(data);
   $('#notice-manage-splunk-hosts').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   hostNumber=$("#input-splunk-host-edit-host-number").val();
   $("#admin-host-"+hostNumber+"-name").html($('#input-splunk-host-edit-name').val());
   $("#admin-host-"+hostNumber+"-role").html($('#select-splunk-host-edit-role').val());
   $("#admin-host-"+hostNumber+"-env").html($('#select-splunk-host-edit-env').val());
   $('#modal-splunk-host-edit').modal('toggle');
   }
   else if(whom=="splunk_host_delete") {
   $('#notice-manage-splunk-hosts').html(data);
   $('#notice-manage-splunk-hosts').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   hostNumber=$("#input-splunk-host-delete-host-number").val();
   $($("#admin-host-"+hostNumber+"-name").parent()).remove();
   $('#modal-splunk-host-delete').modal('toggle');
   }
   else if(whom=="announcements_get") {
   $("#splunk-users-announcements-table").append("<thead id=\"splunk-users-announcements-table-head\"> <tr id=\"splunk-users-announcements-table-row\"> <th style=\"width: 10%\" id=\"splunk-users-announcements-table-date\">Date</th> <th style=\"width: 10%\" id=\"splunk-users-announcements-table-announce\">Announcement</th> </tr></thead>");
   jQuery.each(data, function(index, value) {
    ndate=formatDate(value.created_at);
    $("#announcements-list").append("<li>" + ndate + " " + value.announce + "</li>");
    $("#splunk-users-announcements-table").append("<tr > <td class=\"splunk-users-announcements-table-date\">"+ ndate +"</td><td class=\"splunk-users-announcements-table-announce\">"+ value.announce +"</td></tr>");
   });

   }
   else if(whom=="admin_announcements_get") {
   $("#admin-announcements-table").append("<thead id=\"admin-announcements-table-head\"> <tr id=\"admin-announcements-table-row\"> <th style=\"width: 10%\" id=\"admin-announcements-table-announce\">Announcement</th><th style=\"width: 10%\" id=\"admin-announcements-table-status\">Status</th><th style=\"width: 10%\" id=\"admin-announcements-table-date\">Date</th><th style=\"width: 10%\" id=\"admin-announcements-table-edit\">Edit</th><th style=\"width: 10%\" id=\"admin-announcements-table-delete\">Delete</th></thead>");
   jQuery.each(data, function(index, value) {
    var ndate=formatDate(value.created_at);
    var status="";
    if(value.status==1) {
      status="Publish";
    }
    else {
      status="Do Not Publish";
    }
    $("#admin-announcements-table").append("<tr id=\"admin-announcements-table-row-"+index+"\"> <td class=\"admin-announcements-table-announce\" id=\"admin-announcements-"+index+"-announce\">"+ value.announce +"</td><td class=\"admin-announcements-table-status\" id=\"admin-announcements-"+index+"-status\">"+ status +"</td><td class=\"admin-announcements-table-date\" id=\"admin-announcements-"+index+"-date\">"+ ndate +"</td><td> <button type=\"button\" onclick=\"openModalAnnouncementEdit("+index+","+ value.id +")\" class=\"btn btn-primary\" id=\"button-announcement-edit-"+index+"\">Edit</button> </td> <td> <button type=\"button\" class=\"btn btn-danger\" id=\"button-announcement-delete-"+index+"\" onclick=\"openModalAnnouncementDelete("+index+","+ value.id +")\" >Delete</button> </td></tr>");
   });
   getAllAnnouncementsList();
   }
   else if(whom=="announcement_add") {
   $('#notice-manage-announcements').html(data);
   $('#notice-manage-announcements').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   child=$("tbody").children();
   announce=$('#input-announcement-add-announce').val();
   status=$('#select-announcement-add-status').val();
   if (child.length==0) {
     $('thead').append("<tr> <td class=\"admin-announcements-table-announce\">"+ announce +"</td><td class=\"admin-announcements-table-status\">"+ status +"</td><td class=\"admin-announcements-table-date\"></td><td>Available on Refresh</td><td>Available on Refresh</td> </tr>");
   }
   else {
     $(child[0]).before("<tr> <td class=\"admin-announcements-table-announce\">"+ announce +"</td><td class=\"admin-announcements-table-status\">"+ status +"</td><td class=\"admin-announcements-table-date\"></td><td>Available on Refresh</td><td>Available on Refresh</td> </tr>");
   }
   $('#modal-announcement-add').modal('toggle');
   }
   else if(whom=="announcement_edit") {
   $('#notice-manage-announcements').html(data);
   $('#notice-manage-announcements').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   announcementNumber=$("#input-announcement-edit-announcement-number").val();
   $("#admin-announcements-"+announcementNumber+"-announce").html($('#input-announcement-edit-announce').val());
   $("#admin-announcements-"+announcementNumber+"-status").html($('#select-announcement-edit-status').val());
   $('#modal-announcement-edit').modal('toggle');
   }
   else if(whom=="announcement_delete") {
   $('#notice-manage-announcements').html(data);
   $('#notice-manage-announcements').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   announcementNumber=$("#input-announcement-delete-announcement-number").val();
   $($("#admin-announcements-"+announcementNumber+"-announce").parent()).remove();
   $('#modal-announcement-delete').modal('toggle');
   }
   else if(whom=="admin_test_get") {
   }
   else if(whom=="admin_get_portal_users") {
  jQuery.each(data, function(index, value) {
    $("#select-link-splunk-account").append("<option>"+value.splunk_user_name+"</option>");
  });
  $("#select-link-splunk-account").append();
   }
   else if(whom=="admin_get_portal_user_information") {
   $("#input-link-splunk-account-id").val(data.id);
   $("#input-link-splunk-account-email").val(data.email);
   $("#input-link-splunk-account-user-name").val(data.splunk_user_name);
   $("#input-link-splunk-account-group-name").val(data.group_name);
   $("#input-link-splunk-account-app-team-name").val(data.app_team_name);
   $("#input-link-splunk-account-service-id").val(data.serviceid);
   }
   else if(whom=="announcements_count_get") {
   if (data>0) {
     $("#badge-navbar-user-name-announce-count").html(data);
     $("#badge-navbar-announcement-announce-count").html(data);
   }
   }
   else if(whom=="splunk_host_statistics_get") {
   removeThisElementChildren("#div-sidebar-extra");
   $("#div-sidebar-extra").prepend("<h2>Hosts Statistics</h2><br><br><br>");
   jQuery.each(data, function(index, value) {
    jQuery.each(value, function(idx, val) {
       $("#div-sidebar-extra").append(val[0][0]+":"+val[0][1]+"<br>");
    });
    $("#div-sidebar-extra").append("<br>");
   });
   }
   else if(whom=="portal_account_statistics_get") {
   removeThisElementChildren("#div-sidebar-extra");
   $("#div-sidebar-extra").prepend("<h2>Accounts Statistics</h2><br><br><br>");
   jQuery.each(data, function(index, value) {
    jQuery.each(value, function(idx, val) {
       $("#div-sidebar-extra").append(val[0]+":"+val[1]+"<br>");
    });
    $("#div-sidebar-extra").append("<br>");
   });
   }
   else if(whom=="splunk_user_statistics_get") {
   removeThisElementChildren("#div-sidebar-extra");
   $("#div-sidebar-extra").prepend("<h2>Users Statistics</h2><br><br><br>");
   jQuery.each(data, function(index, value) {
    jQuery.each(value, function(idx, val) {
       $("#div-sidebar-extra").append(val[0][0]+":"+val[0][1]+"<br>");
    });
    $("#div-sidebar-extra").append("<br>");
   });
   }
  else if(whom==getForwarders) {
    getForwardersSet(data);
  }

  else if(whom==deleteForwarder) {
    deleteForwarderSet(data);
  }
   else if(whom==getForwarderCount) {
    getForwarderCountSet(data);
   }
   
   else if(whom=="user_forwarders_list") {
   jQuery.each(data, function(index, value) {
     $("#"+targetSplunkForwarders).append("<option>"+value+"</option>");
   });
   }
   else if(whom=="user_inputs_add") {
   removeThisElementChildren("#user-inputs-table"); //remove old table
   removeThisElementChildren("#user-inputs-script-table"); //remove old table
   removeThisElementChildren("#user-inputs-unixapp-table"); //remove old table
   removeThisElementChildren("#modal-add-unixapp-input-table"); //remove old table

   if(getInputs)
   {
    ajaxCall("userinputs");  //to update inputs list //should call only once when multiple unixapp-inputs added at one time
    getInputs = false;
   }

   $('#notice-manage-inputs').html(data);
   $('#notice-manage-inputs').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   child=$("#user-inputs-table tbody").children();
   account=$('#a-navbar-user-name').html();
   hostname=$("#input-setup-inputs-add-log-file-path").val();
   requestedAt="Just Now";
   status="Requested";
   if (child.length==0) {
    $('thead').append("<tr> <td class=\"user-inputs-table-action\">"+hostname+"</td><td class=\"user-inputs-table-status\">Available On Refresh</td><td>Available on Refresh</td><td>Available On Refresh</td><td>"+requestedAt+"</td> </tr>");
   }
   else {
     $(child[0]).before("<tr> <td class=\"user-inputs-table-action\">"+hostname+"</td><td class=\"user-inputs-table-status\">Available On Refresh</td><td>Available on Refresh</td><td>Available On Refresh</td><td>"+requestedAt+"</td> </tr>");
   }
   $('#modal-inputs-add').modal('hide'); //cannot use toggle here, because of multiple submission when unix app is selected.
   }
   else if(whom=="user_inputs_edit") {  
   removeThisElementChildren("#user-inputs-table"); //remove old table
   removeThisElementChildren("#user-inputs-script-table"); //remove old table
   removeThisElementChildren("#user-inputs-unixapp-table"); //remove old table
   removeThisElementChildren("#modal-add-unixapp-input-table"); //remove old table
   ajaxCall("userinputs");  //to update inputs list

   $('#modal-inputs-edit').modal('toggle');
   $('#notice-manage-inputs').html(data);
   $('#notice-manage-inputs').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   }
   else if(whom=="user_inputs_delete") {
    $('#modal-inputs-delete').modal('toggle');
    $('#notice-manage-inputs').html(data);
    $('#notice-manage-inputs').css("display","block");
    alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
    if (data.indexOf("This Input is Linked to Some App") == -1) { //successed
    logNumber=$("#input-inputs-delete-log-number").val();
    $("#user-inputs-table-row-"+logNumber).remove();
    }
   }
   else if(whom=="user_inputs_fetch_record") {
   jQuery.each(data, function(index, value) {
     if(index=="id") {
    env = $("#hidden-text-env").val();
    $("#input-setup-inputs-"+targetLogAction+"-script-content").attr("href", "/splunk_users/showscriptcontent/" + value + "?env=" + env);
     }
     if(index=="log_file_path") {
     $("#input-setup-inputs-"+targetLogAction+"-log-file-path").val(value);
     }
     else if(index=="sourcetype") {
     $("#input-setup-inputs-"+targetLogAction+"-source-type").val(value);
     }
     else if(index=="log_file_size") {
     $("#select-setup-inputs-"+targetLogAction+"-log-file-size").val(value);
     }
     else if(index=="data_retention_period") {
     $("#select-setup-inputs-"+targetLogAction+"-log-retention-period").val(value);
     }
     else if(index=="memo") {
     $("#input-setup-inputs-"+targetLogAction+"-memo").val(value);
     }
     else if(index=="crcsalt") {
     $("#select-setup-inputs-"+targetLogAction+"-crcsalt").val(value); //only for details action
     removeThisElementChildren("#edit-inputs-crcsalt");
     checked="";
     if (value == "<SOURCE>") //the same as it in the database
     {
      checked = "checked";
     }
     //for edit dialog checkbox
     $("#edit-inputs-crcsalt").append("<label  class=\"btn\" style=\"float:left;margin:5px 5px 0px 0px\"><input id = \"select-setup-inputs-edit-log-crcsalt\" type=\"checkbox\" value=\"&lt;SOURCE&gt;\" "+checked+">&lt;SOURCE&gt;</label> ");
     }
     else if(index=="blacklist") {
    if (value != null) 
    {
      //to handle old version .gz$
      if (value[0] == ".")
      {
      value = value.substring(1,value.length-1);
      value = "\\.(" + value + ")$";
      }
    }
    $("#input-setup-inputs-"+targetLogAction+"-blacklist-files").val(value);
     }
     else if (index=="interval"){
     $("#input-setup-inputs-"+targetLogAction+"-interval").val(value);
     }
     else if (index=="os"){
     $("#input-setup-inputs-"+targetLogAction+"-os").val(value);
     if (value == "*nix") {
      $("#edit-input-nix-radio").prop('checked', true);
     }
     else if(value == "windows"){
      $("#edit-input-win-radio").prop('checked', true);
     }
     }
     else if (index=="script_name"){
     $("#input-setup-inputs-"+targetLogAction+"-unixapp-scriptname").val(value);//only for editting unix app input
     $("#input-setup-inputs-"+targetLogAction+"-scriptname").val(value);
     }
     else if (index=="option"){
     $("#input-setup-inputs-"+targetLogAction+"-option").val(value);
     }
   });
   }
   else if(whom=="input_logs_statistics_get") {
   removeThisElementChildren("#div-sidebar-extra");
   $("#div-sidebar-extra").prepend("<h2>Inputs Statistics</h2><br><br><br>");
   $("#div-sidebar-extra").append("<div style=\"overflow:auto;height:50%;\" id=\"div-sidebar-extra-inner-div\"></div>");
   jQuery.each(data, function(index, value) {
    jQuery.each(value, function(idx, val) {
       $("#div-sidebar-extra-inner-div").append(val[1]+" : "+val[0]+"<br>");
    });
    $("#div-sidebar-extra-inner-div").append("<br>");
   });
   }
  else if(whom=="admin_user_forwarders_get") {
    var forwarderTable = "";
    forwarderTable += "<thead id=\"admin-forwarders-table-head\">";
    forwarderTable += "<tr id=\"admin-forwarders-table-row\">";
    forwarderTable += "<th style=\"width: 10%\">Forwarder Name</th>";
    forwarderTable += "<th style=\"width: 10%\">User</th>";
    forwarderTable += "<th style=\"width: 10%\">Date</th>";
    forwarderTable += "<th style=\"width: 10%\">Environment</th>";
    forwarderTable += "<th style=\"width: 10%\">Suggest Change</th>";
    forwarderTable += "</tr></thead>";
    jQuery.each(data, function(index, value) {
      var ndate=formatDate(value.created_at);
      var user=value.env.substring(value.env.indexOf('u'),value.env.length);
      var env=value.env.substring(0,value.env.indexOf('u'));
      forwarderTable += "<tr> <td id=\"admin-forwarders-"+index+"-name\">"+ value.name +"</td>";
      forwarderTable += "<td>"+ user +"</td>";
      forwarderTable += "<td>"+ ndate +"</td>";
      forwarderTable += "<td>"+env+" </td>";
      forwarderTable += "<td> <button class=\"btn btn-info\" onclick=\"openModalForwardersSuggest("+index+","+ value.id +")\" >Suggest</button> </td>";
      forwarderTable += "</tr>";
    });
    $("#admin-forwarders-table").append(forwarderTable);
  }
   else if(whom=="admin_user_forwarders_suggest_change") {
   $("#modal-forwarder-suggest-change").modal('toggle');
   }
   else if(whom=="admin_user_forwarders_list") {
   jQuery.each(data, function(index, value) {
     $("#"+targetSplunkForwarders).append("<option>"+value.name+"</option>");
   });
   }
   else if(whom=="admin_user_inputs_suggest_change") {
   $("#modal-inputs-suggest-change").modal('toggle');
   }
   else if(whom=="user_server_class_add") {
   removeThisElementChildren("#user-server-class-table"); //remove old table
   ajaxCall(getServerClasses); //refresh server class tbale

   $("#modal-server-class-add").modal('toggle');
   $('#notice-manage-forwarders-server-class').html(data);
   $('#notice-manage-forwarders-server-class').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   child=$("#user-server-class-table tbody").children();
   ndate="Just Now";
   name=$("#input-server-class-add-name").val();
   if (child.length==0) {
     $('thead').append("<tr id=\"user-server-class-table-row-just-added\"> <td class=\"user-server-class-table-name\" id=\"user-server-class-just-added-name\">"+ name +"</td><td class=\"user-server-class-table-date\" id=\"user-server-class-just-added-date\">"+ ndate +"</td><td> Available on Refresh </td> <td> Available on Refresh </td></tr>");
   }
   else {
     $(child[0]).before("<tr id=\"user-server-class-table-row-just-added\"> <td class=\"user-server-class-table-name\" id=\"user-server-class-just-added-name\">"+ name +"</td><td class=\"user-server-class-table-date\" id=\"user-server-class-just-added-date\">"+ ndate +"</td><td> Available on Refresh </td> <td> Available on Refresh </td></tr>");
   }
   }
  else if(whom==getServerClasses) {
    var serverClassTable = "";
    serverClassTable += "<thead id=\"user-server-class-table-head\">";
    serverClassTable += "<tr id=\"user-server-class-table-row\">";
    serverClassTable += "<th style=\"width: 20%\">Server Class</th>";
    serverClassTable += "<th style=\"width: 20%\">Date</th>";
    serverClassTable += "<th style=\"width: 20%\">Show</th>";
    serverClassTable += "<th style=\"width: 20%\">Edit</th>";
    serverClassTable += "<th style=\"width: 20%\">Delete</th>";
    serverClassTable += "</tr></thead>";

  if (data.length == 0 ) {
    displayNoticeElement( "notice-manage-forwarders-server-class", "No Data Available Currently. Please Input Some Data First." );
  }

  jQuery.each(data, function(index, value) {
    var ndate=formatDate(value.created_at);
    serverClassTable += "<tr name=\""+value.id+"\" id=\"user-server-class-table-row-"+index +"\" >";
    serverClassTable += "<td id=\"user-server-class-"+index+"-name\">"+ value.name +"</td>";
    serverClassTable += "<td>"+ ndate +"</td>";
    serverClassTable += "<td> <button onclick=\"openModalServerClassShow("+index+","+ value.id +")\" class=\"btn btn-info\"><i class=\"fa fa-list\" aria-hidden=\"true\"></i>Show</button> </td>";
    serverClassTable += "<td> <button class=\"btn btn-primary\" onclick=\"openModalServerClassEdit("+index+","+ value.id +")\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i>Edit</button> </td>";
    serverClassTable += "<td> <button class=\"btn btn-danger\" onclick=\"openModalServerClassDelete("+index+","+ value.id +")\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i>Delete</button> </td>";
    serverClassTable += "</tr>";
    });
    $("#user-server-class-table").append(serverClassTable);
    targetTableRow = "user-server-class-table-row-";
    getAllServerClassesList();
    if(highlightEditedRow){
      setColorForRow("user-server-class-table", "input-server-class-edit");
      highlightEditedRow = false;
    }
    if(highlightAddedRow){
      setColorForRow("user-server-class-table", "serverclass-add");
      highlightAddedRow = false;
    }
   }

   else if(whom=="user_server_class_filter_get") {
     $("#modal-user-server-class-table").append("<thead id=\"user-forwarders-table-head\"> <tr id=\"user-forwarders-table-row\"> <th><input type=\"checkbox\" onclick=\"changeCheckBoxStatus(this,\'modal-usc-table-check\')\" id =\"modal-usc-table-check-all\"/></th> <th style=\"\" id=\"user-forwarders-table-name\">Forwarder</th></thead>");
   jQuery.each(data, function(index, value) {
    $("#modal-user-server-class-table").append("<tr id=\"modal-user-server-class-table-row-"+index+"\" > <td><input type=\"checkbox\" class=\"modal-usc-table-check\" value=\""+value+"\"/></td>  <td class=\"modal-user-server-class-table\" id=\"modal-user-server-class-table-"+index+"-server-class-name\">"+ value +"</td></tr>");
   });
   targetTableRow="modal-user-server-class-table-row-";
   getAllClientsList();
   }
   else if(whom==getForwardersFromDeploymentServer) {
    getForwardersFromDeploymentServerSet(data);
   }
  else if(whom=="user_forwarders_from_deployment_server_add") {
    removeThisElementChildren($("#user-forwarders-table")); //remove old table
    ajaxCall(getForwarders); //refresh frowarders table

    $('#notice-manage-forwarders').html(data);
    $('#notice-manage-forwarders').css("display","block");
    alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
      clearTimeout(alertNoticesTimeoutVar);
      alertNoticesTimeoutVar = clearAlertNotices();
    }
    child=$("#user-forwarders-table tbody").children();
    name=$("#input-forwarder-add-from-deployment-server-forwarder-names").val();
    names=name.split("|");
    if (child.length==0) {
      jQuery.each(names, function(index, value) {
      $('thead').append("<tr> <td class=\"user-forwarders-table-name\">"+ value +"</td><td class=\"user-forwarders-table-date\"></td><td>Available on Refresh</td><td>Available on Refresh</td> </tr>");
      });
    }
    else{
      jQuery.each(names, function(index, value) {
      $(child[0]).before("<tr> <td class=\"user-forwarders-table-name\">"+ value +"</td><td class=\"user-forwarders-table-date\"></td><td>Available on Refresh</td><td>Available on Refresh</td> </tr>");
      });
    }
    $("#modal-forwarder-add-from-deployment-server").modal('toggle');
  }
   else if(whom==getForwardersFromServerClass) {
    getForwardersFromServerClassSet(data);
   }
   else if(whom=="user_server_class_edit_clients_get") {
   regexBreakPoint = data.indexOf("regex");
   regex = data.splice(regexBreakPoint);
   regex = regex.splice(1);
   $("#input-server-class-edit-regex").val(regex[0]);
   breakPoint=data.indexOf("ends");
   clients=data.splice(0,breakPoint);
   forwarders=data.splice(1);
   $("#modal-user-server-class-edit-table").append("<thead > <tr><th><input type=\"checkbox\" onclick=\"changeCheckBoxStatus(this,\'modal-usce-table-check\')\" id =\"modal-usce-table-check-all\"/></th> <th style=\"\">Forwarders</th></thead>");
   count = 0;
   jQuery.each(clients, function(index, value) {
    $("#modal-user-server-class-edit-table").append("<tr id=\"modal-user-server-class-edit-table-row-"+count+"\"><td><input type=\"checkbox\" class=\"modal-usce-table-check\" value=\""+value+"\" checked/></td> <td id=\"modal-user-server-class-edit-"+count+"-forwarder-name\">"+value+"</td></tr>");
    count += 1;
   });
   jQuery.each(forwarders, function(index, value) {
    $("#modal-user-server-class-edit-table").append("<tr id=\"modal-user-server-class-edit-table-row-"+count+"\"> <td><input type=\"checkbox\" class=\"modal-usce-table-check\" value=\""+value+"\"/></td> <td id=\"modal-user-server-class-edit-"+count+"-forwarder-name\">"+value+"</td></tr>");
    count+=1;
   });
   targetTableRow = "modal-user-server-class-edit-table-row-";
   getAllEditForwardersList();
   }
   else if(whom=="user_server_class_edit") {
  removeThisElementChildren("#user-server-class-table");
  ajaxCall(getServerClasses);

   $("#modal-server-class-edit").modal('toggle');
   $('#notice-manage-forwarders-server-class').html(data);
   $('#notice-manage-forwarders-server-class').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   }
   else if(whom=="user_server_class_delete") {
   $('#modal-server-class-delete').modal('toggle');
   $('#notice-manage-forwarders-server-class').html(data);
   $('#notice-manage-forwarders-server-class').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   serverClassNumber=$("#input-server-class-delete-server-class-number").val();
   $($("#user-server-class-"+serverClassNumber+"-name").parent()).remove();
   }
  else if(whom=="user_apps_add") {
    $('#notice-manage-apps').html(data);
    $('#notice-manage-apps').css("display","block");
    alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
      clearTimeout(alertNoticesTimeoutVar);
      alertNoticesTimeoutVar = clearAlertNotices();
    }
    removeThisElementChildren("#user-apps-table"); //remove old app table;
    ajaxCall("user_apps_get"); //refresh apps table

   $("#modal-apps-add").modal('toggle');
   child=$("#user-apps-table tbody").children();
   name=$("#input-apps-add-name").val();
   if (child.length==0) {
     $('thead').append("\
    <tr id=\"user-apps-table-row-just-now\"> \
    <td id=\"user-apps-table-JUST-NOW-name\">" + name + "</td> \
    <td> REFRESH TO SEE</td>\
    <td> REFRESH TO EDIT</td>\
    <td>REFRESH TO DELETE</td>\
    <td>REFRESH TO SET</td>\
    <td>JUST NOW</td>\
    </tr>");
   }
   else {
     $(child[0]).before("\
    <tr id=\"user-apps-table-row-just-now\"> \
    <td id=\"user-apps-table-JUST-NOW-name\">" + name + "</td> \
    <td> REFRESH TO SEE</td>\
    <td> REFRESH TO EDIT</td>\
    <td>REFRESH TO DELETE</td>\
    <td>REFRESH TO SET</td>\
    <td>JUST NOW</td>\
    </tr>");
   }
   }

   //config apps -> apps
  else if(whom=="user_apps_get") {
    var appTable = "";
    appTable += "<thead><tr>";
    appTable += "<th>App Name</th>";
    appTable += "<th>Show</th>";
    appTable += "<th>Edit</th>";
    appTable += "<th>Delete</th>";
    appTable += "<th>Created At</th>";
    appTable += "</tr></thead>";
    
    if (data.length == 0 ) {
      displayNoticeElement( "notice-manage-apps", "No Data Available Currently. Please Input Some Data First." );
    }

    jQuery.each(data, function(index, value) {
      var ndate=formatDate(value.created_at);
      var type = 0;
      if(value.unixapp){
        type = 1;
      }
      appTable += "<tr name=\""+value.id+"\" id=\"user-apps-table-row-"+index+"\">";
      appTable += "<td style=\"word-break: break-all; width: 40%\" id=\"user-apps-table-" + index + "-name\">" + value.name + "</td>";

      appTable += "<td> <button onclick=\"openModalAppShow("+index+","+ value.id + "," + type +")\" class=\"btn btn-info\"><i class=\"fa fa-list\" aria-hidden=\"true\"></i>Show</button></td>";
      appTable += "<td> <button onclick=\"openModalAppEdit("+index+","+ value.id + "," + type +")\" class=\"btn btn-primary\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i>Edit</button></td>";
      if (value.deploy_status != 1 && value.deploy_status != 2){
        appTable += "<td> <button class=\"btn btn-danger\" onclick=\"openModalAppDelete("+index+","+ value.id +")\" ><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i>Delete</button></td>";
      }else{
        appTable += "<td><a data-placement=\"right\" data-toggle=\"tooltip\" title=\"Please remove configuration in 'Deploy Apps' before deleting\">Not Available</a></td>";
      }
      appTable += "<td>" + ndate + "</td>";
      appTable += "</tr>";
    });

    $("#user-apps-table").append(appTable);
    targetTableRow= "user-apps-table-row-";
    getAllAppsList();
    if (highlightEditedRow){
      setColorForRow("user-apps-table", "input-apps-edit-app");
      highlightEditedRow = false;
    }
    if (highlightAddedRow){
      setColorForRow("user-apps-table", "app-add");
      highlightAddedRow = false;
    }

    $('[data-toggle="tooltip"]').tooltip();
  }

   //Add Apps dialog
    else if(whom=="user_inputs_get") {
    var logCheckbox = "<th><input type=\"checkbox\" onclick=\"changeCheckBoxStatus(this,\'modal-ua-table-check\')\" id =\"modal-ua-table-check-all\"/></th>";
    var scriptCheckbox = "<th><input type=\"checkbox\" onclick=\"changeCheckBoxStatus(this,\'modal-ua-table-script-check\')\" id =\"modal-ua-table-script-check-all\"/></th>";
    var unixappCheckbox = "<th><input type=\"checkbox\" onclick=\"changeCheckBoxStatus(this,\'modal-ua-table-unixapp-check\')\" id =\"modal-ua-table-unixapp-check-all\"/></th>";
    var logInputTable = getInputTableHeader("log", logCheckbox);
    var scriptInputTable = getInputTableHeader("script", scriptCheckbox);
    var unixappInputTable = getInputTableHeader("unixapp", unixappCheckbox);
    jQuery.each(data, function(index, value) {
      crcsalt = formatCrcSalt(value.crcsalt);
      if (value.log_file_path != null) { //log
        logInputTable += "<tr id=\"user-apps-add-table-row-"+index+"\">";
        logInputTable += "<td><input type=\"checkbox\" class=\"modal-ua-table-check\" value=\" " + value.id + " \"/></td>";
        logInputTable += "<td style=\"word-break: break-all; width: 30%\">"+value.log_file_path+"</td>";
        logInputTable += "<td>"+value.sourcetype+"</td>";
        logInputTable += "<td>"+value.log_file_size+"</td>";
        logInputTable += "<td>"+value.data_retention_period+"</td>";
        logInputTable += "<td>"+crcsalt+"</td>";
        logInputTable += "<td>"+value.blacklist+"</td>";
        logInputTable += "<td style=\"word-break: break-all; width:15%;\">"+value.memo+"</td>";
        logInputTable += "</tr>";
      }
      else if (value.os != null){ //script
        scriptInputTable += "<tr id=\"user-apps-add-table-row-"+index+"\">";
        scriptInputTable += "<td><input type=\"checkbox\" class=\"modal-ua-table-script-check\" value=\" " + value.id + " \"/></td>";
        scriptInputTable += "<td>"+value.script_name+"</td>";
        scriptInputTable += "<td>"+value.sourcetype+"</td>";
        scriptInputTable += "<td>"+value.log_file_size+"</td>";
        scriptInputTable += "<td>"+value.data_retention_period+"</td>";
        scriptInputTable += "<td>"+value.interval+"</td>";
        scriptInputTable += "<td>"+value.os+"</td>";
        scriptInputTable += "<td>"+value.option+"</td>";
        scriptInputTable += "<td style=\"word-break: break-all; width:15% \">"+value.memo+"</td>";
        scriptInputTable += "</tr>";
      }
      else if(value.script_name != null){ //unix app
        unixappInputTable += "<tr id=\"user-apps-add-table-row-"+index+"\">";
        unixappInputTable += "<td><input type=\"checkbox\" class=\"modal-ua-table-unixapp-check\" value=\" " + value.id + " \"/></td>";
        unixappInputTable += "<td>"+value.script_name+"</td>";
        unixappInputTable += "<td>"+value.data_retention_period+"</td>";
        unixappInputTable += "<td>"+value.interval+"</td>";
        unixappInputTable += "<td style=\"word-break: break-all; width:15%;\">"+value.memo+"</td>";
        unixappInputTable += "</tr>";
      }
    });

    $("#modal-user-apps-add-table").append(logInputTable);
    $("#modal-user-apps-add-script-table").append(scriptInputTable);
    $("#modal-user-apps-add-unixapp-table").append(unixappInputTable);
    targetTableRow = "user-apps-add-table-row-";
    getAllAddAppInputsList(); //unused?
    }

  //Edit app dialog
  else if(whom=="user_app_edit_inputs_get") {
    var logCheckbox = "<th><input type=\"checkbox\" onclick=\"changeCheckBoxStatus(this,\'modal-uae-table-check\')\" id =\"modal-uae-table-check-all\" /></th>";
    var scriptCheckbox = "<th><input type=\"checkbox\" onclick=\"changeCheckBoxStatus(this,\'modal-uae-table-script-check\')\" id =\"modal-uae-table-check-script-all\" /></th>";
    var unixappCheckbox = "<th><input type=\"checkbox\" onclick=\"changeCheckBoxStatus(this,\'modal-uae-table-unixapp-check\')\" id =\"modal-uae-table-check-unixapp-all\" /></th>";
    var logInputTable = getInputTableHeader("log", logCheckbox);
    var scriptInputTable = getInputTableHeader("script", scriptCheckbox);
    var unixappInputTable = getInputTableHeader("unixapp", unixappCheckbox);

    breakPoint=data.indexOf("ends");
    app_inputs = data.splice(0,breakPoint);  //inputs already in this app
    inputs = data.splice(1); //inputs not allocated
    count = 0;
    jQuery.each(app_inputs, function(index, value) { //inputs in this app
      if (value.log_file_path != null) { //log
        crcsalt = formatCrcSalt(value.crcsalt);
        logInputTable += "<tr id=\"modal-user-apps-edit-table-row-"+count+"\">";
        logInputTable += "<td><input type=\"checkbox\" class=\"modal-uae-table-check\" value=\" " + value.id + " \" checked /></td>";
        logInputTable += "<td style=\"word-break: break-all;width: 30%\">"+value.log_file_path+"</td>";
        logInputTable += "<td>"+value.sourcetype+"</td>";
        logInputTable += "<td>"+value.log_file_size+"</td>";
        logInputTable += "<td>"+value.data_retention_period+"</td>";
        logInputTable += "<td>"+crcsalt+"</td>";
        logInputTable += "<td>"+value.blacklist+"</td>";
        logInputTable += "<td style=\"word-break: break-all;width: 15%\">"+value.memo+"</td>";
        logInputTable += "</tr>";
        count += 1;
      }
      else if(value.os != null){ //script
          scriptInputTable += "<tr id=\"modal-user-apps-edit-table-row-"+count+"\">";
        scriptInputTable += "<td><input type=\"checkbox\" class=\"modal-uae-table-script-check\" value=\" " + value.id + " \" checked /></td>";
        scriptInputTable += "<td style=\"word-break: break-all;width: 30%\">"+value.script_name+"</td>";
        scriptInputTable += "<td>"+value.sourcetype+"</td>";
        scriptInputTable += "<td>"+value.log_file_size+"</td>";
        scriptInputTable += "<td>"+value.data_retention_period+"</td>";
        scriptInputTable += "<td>"+value.interval+"</td>";
        scriptInputTable += "<td>"+value.os+"</td>";
        scriptInputTable += "<td>"+value.option+"</td>";
        scriptInputTable += "<td style=\"word-break: break-all;width: 15%\">"+value.memo+"</td>";
        scriptInputTable += "</tr>";
        count += 1;
      }
      else if(value.script_name != null){//unixapp input
        unixappInputTable += "<tr id=\"modal-user-apps-edit-table-row-"+count+"\">";
        unixappInputTable += "<td><input type=\"checkbox\" class=\"modal-uae-table-unixapp-check\" value=\" " + value.id + " \" checked /></td>";
        unixappInputTable += "<td style=\"word-break: break-all;width: 20%\">"+value.script_name+"</td>";
        unixappInputTable += "<td>"+value.data_retention_period+"</td>";
        unixappInputTable += "<td>"+value.interval+"</td>";
        unixappInputTable += "<td style=\"word-break: break-all;width: 50%\">"+value.memo+"</td>";
        unixappInputTable += "</tr>";
        count += 1;
      }
    });

    jQuery.each(inputs, function(index, value) { //inputs not in this app, and available
      if (value.log_file_path != null) {
        crcsalt = formatCrcSalt(value.crcsalt);
        logInputTable += "<tr id=\"modal-user-apps-edit-table-row-"+count+"\">";
        logInputTable += "<td><input type=\"checkbox\" class=\"modal-uae-table-check\" value=\""+value.id+"\" /></td>";
        logInputTable += "<td style=\"word-break: break-all; width: 30%\">"+value.log_file_path+"</td>";
        logInputTable += "<td>"+value.sourcetype+"</td>";
        logInputTable += "<td>"+value.log_file_size+"</td>";
        logInputTable += "<td>"+value.data_retention_period+"</td>";
        logInputTable += "<td>"+crcsalt+"</td>";
        logInputTable += "<td>"+value.blacklist+"</td>";
        logInputTable += "<td style=\"word-break: break-all;width: 20%\">"+value.memo+"</td>";
        logInputTable += "</tr>";
        count += 1;
      }
      else if(value.os != null){ //script
        scriptInputTable += "<tr id=\"modal-user-apps-edit-table-row-"+count+"\">";
        scriptInputTable += "<td><input type=\"checkbox\" class=\"modal-uae-table-script-check\" value=\" " + value.id + " \" /></td>";
        scriptInputTable += "<td style=\"word-break: break-all;width: 30%\">"+value.script_name+"</td>";
        scriptInputTable += "<td>"+value.sourcetype+"</td>";
        scriptInputTable += "<td>"+value.log_file_size+"</td>";
        scriptInputTable += "<td>"+value.data_retention_period+"</td>";
        scriptInputTable += "<td>"+value.interval+"</td>";
        scriptInputTable += "<td>"+value.os+"</td>";
        scriptInputTable += "<td>"+value.option+"</td>";
        scriptInputTable += "<td style=\"word-break: break-all;width: 15%\">"+value.memo+"</td>";
        scriptInputTable += "</tr>";
        count += 1;
      }
      else if(value.script_name != null){//unixapp input
        unixappInputTable += "<tr id=\"modal-user-apps-edit-table-row-"+count+"\">";
        unixappInputTable += "<td><input type=\"checkbox\" class=\"modal-uae-table-unixapp-check\" value=\" " + value.id + " \" /></td>";
        unixappInputTable += "<td style=\"word-break: break-all;width: 20%\">"+value.script_name+"</td>";
        unixappInputTable += "<td>"+value.data_retention_period+"</td>";
        unixappInputTable += "<td>"+value.interval+"</td>";
        unixappInputTable += "<td style=\"word-break: break-all;width: 50%\">"+value.memo+"</td>";
        unixappInputTable += "</tr>";
        count += 1;
      }
    });
    $("#modal-user-apps-edit-table").append(logInputTable);
    $("#modal-user-apps-edit-script-table").append(scriptInputTable);
    $("#modal-user-apps-edit-unixapp-table").append(unixappInputTable);
    targetTableRow = "modal-user-apps-edit-table-row-";
    getAllEditAppInputsList();
  }

  else if(whom=="user_apps_edit") { //refresh app list
    removeThisElementChildren("#user-apps-table"); //remove old app table
    ajaxCall("user_apps_get");
    $('#modal-apps-edit').modal('toggle');
    $('#notice-manage-apps').html(data);
    $('#notice-manage-apps').css("display","block");
    alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
      clearTimeout(alertNoticesTimeoutVar);
      alertNoticesTimeoutVar = clearAlertNotices();
    }
  }

  //show app dialog
  else if(whom=="user_app_get") {
    var logInputTable = getInputTableHeader("log");
    var scriptInputTable = getInputTableHeader("script");
    var unixappInputTable = getInputTableHeader("unixapp");
    jQuery.each(data, function(index, value) {
      if (value.log_file_path != null) { //log
        crcsalt = formatCrcSalt(value.crcsalt);
        logInputTable += "<tr id=\"modal-user-apps-show-table-row-"+index+"\">";
        logInputTable += "<td style=\"word-break: break-all; width: 30%\">"+value.log_file_path+"</td>";
        logInputTable += "<td>"+value.sourcetype+"</td>";
        logInputTable += "<td>"+value.log_file_size+"</td>";
        logInputTable += "<td>"+value.data_retention_period+"</td>";
        logInputTable += "<td>"+crcsalt+"</td>";
        logInputTable += "<td>"+value.blacklist+"</td>";
        logInputTable += "<td style=\"word-break: break-all;width: 20%\">"+value.memo+"</td>";
        logInputTable += "</tr>";
      }
      else if (value.os != null){ //script
        scriptInputTable += "<tr id=\"modal-user-apps-show-table-row-"+index+"\">";
        scriptInputTable += "<td style=\"word-break: break-all;width: 30%\">"+value.script_name+"</td>";
        scriptInputTable += "<td>"+value.sourcetype+"</td>";
        scriptInputTable += "<td>"+value.log_file_size+"</td>";
        scriptInputTable += "<td>"+value.data_retention_period+"</td>";
        scriptInputTable += "<td>"+value.interval+"</td>";
        scriptInputTable += "<td>"+value.os+"</td>";
        scriptInputTable += "<td>"+value.option+"</td>";
        scriptInputTable += "<td style=\"word-break: break-all;width: 15%\">"+value.memo+"</td>";
        scriptInputTable += "</tr>";
      }
      else if(value.script_name != null){ //unix app
        unixappInputTable += "<tr id=\"modal-user-apps-show-table-row-"+index+"\">";
        unixappInputTable += "<td style=\"word-break: break-all;width: 20%\">"+value.script_name+"</td>";
        unixappInputTable += "<td>"+value.data_retention_period+"</td>";
        unixappInputTable += "<td>"+value.interval+"</td>";
        unixappInputTable += "<td style=\"word-break: break-all;width: 50%\">"+value.memo+"</td>";
        unixappInputTable += "</tr>";
      }
    });
    $("#modal-user-apps-show-table").append(logInputTable);
    $("#modal-user-apps-show-script-table").append(scriptInputTable);
    $("#modal-user-apps-show-unixapp-table").append(unixappInputTable);  
  }

   //deploy config dialog
  else if(whom=="user_app_server_class_get") {
    var deployServerClassTable = "";
    var deployLogInputTable = "";
    var deployScriptInputTable = "";
    var deployUnixappInputTable = "";

    deployServerClassTable += "<thead id=\"modal-user-apps-deploy-setting-table-head\">";
    deployServerClassTable += "<tr>";
    deployServerClassTable += "<th style=\"width: 5%\"><input type=\"checkbox\" onclick=\"changeCheckBoxStatus(this,\'modal-uads-table-check\')\" id =\"modal-uads-table-check-all\"/></th>";
    deployServerClassTable += "<th style=\"width: 30%\">Server Class Name</th>";
    deployServerClassTable += "<th style=\"width: 65%\">Forwarder</th>";
    deployServerClassTable += "</tr></thead>";

    deployLogInputTable += getInputTableHeader("log");
    deployScriptInputTable += getInputTableHeader("script");
    deployUnixappInputTable += getInputTableHeader("unixapp");
      cnt=0;
    jQuery.each(data.inputs, function(index, value) {
      if (value.log_file_path != null) {
        crcsalt = formatCrcSalt(data.inputs[cnt].crcsalt);
        deployLogInputTable += "<tr id=\"modal-user-apps-deploy-inputs-table-row-"+index+"\">";
        deployLogInputTable += "<td style=\"word-break: break-all;width: 30%\" > " + data.inputs[cnt].log_file_path + " </td>";
        deployLogInputTable += "<td> " + data.inputs[cnt].sourcetype + " </td>";
        deployLogInputTable += "<td> " + data.inputs[cnt].log_file_size + " </td>";
        deployLogInputTable += "<td> " + data.inputs[cnt].data_retention_period + " </td>";
        deployLogInputTable += "<td> " + crcsalt + " </td>";
        deployLogInputTable += "<td> " + data.inputs[cnt].blacklist + " </td>";
        deployLogInputTable += "<td style=\"word-break: break-all;width: 15%\" > " + data.inputs[cnt].memo + " </td>";
        deployLogInputTable += "</tr>";
        cnt += 1;
      }
      else if(value.os != null){ //script
        deployScriptInputTable += "<tr id=\"modal-user-apps-deploy-inputs-table-row-"+index+"\">";
        deployScriptInputTable += "<td style=\"word-break: break-all;width: 30%\" > " + data.inputs[cnt].script_name + " </td>";
        deployScriptInputTable += "<td>" + data.inputs[cnt].sourcetype + " </td>";
        deployScriptInputTable += "<td>" + data.inputs[cnt].log_file_size + " </td>";
        deployScriptInputTable += "<td>" + data.inputs[cnt].data_retention_period + " </td>";
        deployScriptInputTable += "<td>" + data.inputs[cnt].interval + " </td>";
        deployScriptInputTable += "<td>" + data.inputs[cnt].os + " </td>";
        deployScriptInputTable += "<td>" + data.inputs[cnt].option + " </td>";
        deployScriptInputTable += "<td style=\"word-break: break-all;width: 15%\" > " + data.inputs[cnt].memo + " </td>";
        deployScriptInputTable += "</tr>";
          cnt += 1;
      }
      else if(value.script_name != null){//unixapp
        deployUnixappInputTable += "<tr id=\"modal-user-apps-deploy-inputs-table-row-"+index+"\">";
        deployUnixappInputTable += "<td style=\"word-break: break-all;width: 20%\" > " + data.inputs[cnt].script_name + " </td>";
        deployUnixappInputTable += "<td>" + data.inputs[cnt].data_retention_period + " </td>";
        deployUnixappInputTable += "<td>" + data.inputs[cnt].interval + " </td>";
        deployUnixappInputTable += "<td style=\"word-break: break-all;width: 50%\" > " + data.inputs[cnt].memo + " </td>";
        deployUnixappInputTable += "</tr>";
          cnt += 1;
      }
    });     

    breakPoint=data.serverclasses.indexOf("ends");
    app_server_classes = data.serverclasses.splice(0,breakPoint);
    server_classes = data.serverclasses.splice(1);
    count = 0;

    var all_forwarders = [];
    for (var i = 0; i < data.forwarders.length; i++) {
      breakPoint=data.forwarders[i].indexOf("regex");
      forwarders = data.forwarders[i].splice(0,breakPoint);
      all_forwarders.push(forwarders);
    };

    //requested or approvaled list
    jQuery.each(app_server_classes, function(index, value) {
      var ndate=formatDate(value.created_at);
       var forwarderList = "<ol>";
      for(var i = 0; i < all_forwarders[count].length; i++){
        forwarderList += "<li>" + all_forwarders[count][i] + "</li>";
      }
      forwarderList += "</ol>";
      deployServerClassTable += "<tr style=\"border-bottom: 0px;\" id=\"modal-user-apps-deploy-setting-table-row-"+count+"\" >";
      deployServerClassTable += "<td style=\"width: 5%\"class=\"modal-user-apps-deploy-setting-table-name\"><input type=\"checkbox\" class=\"modal-uads-table-check\" value=\"" + value.id + "\" checked /></td>";
      deployServerClassTable += "<td style=\"word-break: break-all; width: 30%\" id=\"modal-user-apps-deploy-setting-table-"+count+"-name\">"+ value.name +"</td>";
      deployServerClassTable += "<td style=\"word-break: normal; width: 65%;\">" + forwarderList +"</td>";
      deployServerClassTable += "</tr>";
      count += 1;
    });

    //Not requested list
    jQuery.each(server_classes, function(index, value) {
      var ndate=formatDate(value.created_at);
      var forwarderList = "<ol>";
      for(var i = 0; i < all_forwarders[count].length; i++){
        forwarderList += "<li>" + all_forwarders[count][i] + "</li>";
      }
      forwarderList += "</ol>";
      deployServerClassTable += "<tr id=\"modal-user-apps-deploy-setting-table-row-"+count+"\" >";
      deployServerClassTable += "<td style=\"width: 5%\" class=\"modal-user-apps-deploy-setting-table-name\"><input type=\"checkbox\" class=\"modal-uads-table-check\" value=\"" + value.id + "\" /></td>";
      deployServerClassTable += "<td style=\"word-break: break-all; width: 30%\" id=\"modal-user-apps-deploy-setting-table-"+count+"-name\">"+ value.name +"</td>";
      deployServerClassTable += "<td style=\"word-break: normal; width: 65%;\">" + forwarderList +"</td>";
      deployServerClassTable += "</tr>";
      count += 1;
    });

    $("#modal-user-apps-deploy-inputs-table").append(deployLogInputTable);
    $("#modal-user-apps-deploy-inputs-script-table").append(deployScriptInputTable);
    $("#modal-user-apps-deploy-inputs-unixapp-table").append(deployUnixappInputTable);
    $("#modal-user-apps-deploy-setting-table").append(deployServerClassTable);
    targetTableRow = "modal-user-apps-deploy-setting-table-row-";
    getAllAppServerClassesList();
  }


   else if(whom=="user_apps_add_deploy_setting") {
   $('#notice-manage-deploy-requests').html(data); //after deploy config
   $('#notice-manage-deploy-requests').css("display","block");
   $("#modal-apps-deploy-setting").modal('toggle');
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   }
   else if(whom=="user_apps_delete") {
    $('#notice-manage-apps').html(data);
    $('#notice-manage-apps').css("display","block");
    alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
      clearTimeout(alertNoticesTimeoutVar);
      alertNoticesTimeoutVar = clearAlertNotices();
    }
     appNumber = $("#input-apps-delete-app-number").val();
     
     $("#user-apps-table-row-"+appNumber).remove();
     $("#modal-apps-delete").modal('toggle');     
     }
    else if(whom=="user_deploy_requests_apps_get") {
      var appRequestTable = "";
      appRequestTable += "<thead><th style=\"width: 40%\">App Name</th>";
      appRequestTable += "<th style=\"width: 15%\">Status</th>";
      appRequestTable += "<th style=\"width: 15%\">Setting</th>";
      appRequestTable += "<th style=\"width: 15%\">Apply</th>";
      appRequestTable += "<th style=\"width: 15%\">Remove Configuration</th>";
      appRequestTable += "</thead>";
      if (data.length == 0 ) {
        displayNoticeElement( "notice-manage-deploy-requests", "No Data Available Currently. Please Input Some Data First." );
      }
    jQuery.each(data, function(index, value) {
      var deploy_status = "";
      var statusCell = "";
      var stopCell = "<td style=\"width: 20%\">Not Available Yet</td>";
      var ndate=formatDate(value.created_at);
      var type = 0;
      if (value.unixapp){
        type = 1;
      }
      if(value.deploy_status==1){
        deploy_status="Configured";
        statusCell = "<td><p class=\"cell-forwarding\">" + deploy_status + "</p></td>"
        stopCell = "<td style=\"width: 20%\"><button class=\"btn btn-danger\" id=\"button-deploy-requests-stop-forwarding-"+index+"\" onclick=\"openModalAppsDeploySettingStopForwarding("+index+","+value.id+")\" ><i class=\"fa fa-stop\" aria-hidden=\"true\"></i>Remove Configuration</button></td>"
      }
      else if(value.deploy_status==2){
        deploy_status="Requested";
        statusCell = "<td><p class=\"cell-requested\">" + deploy_status + "</p></td>"
      }
      else if(value.deploy_status==9){
        deploy_status="Cancelled";
        statusCell = "<td><p class=\"cell-cancelled\"\">" + deploy_status + "</p></td>"
      }
      else if(value.deploy_status==3){
        deploy_status="Not Configured";
        statusCell = "<td><p class=\"cell-notforwarding\"\">" + deploy_status + "</p></td>"
      }
      else{
        deploy_status="Not requested";
        statusCell = "<td><p class=\"cell-notrequested\"\">" + deploy_status + "</p></td>"
      }

      appRequestTable += "<tr name=\""+value.id+"\" id=\"user-deploy-requests-apps-table-row-"+index+"\">";
      appRequestTable += "<td style=\"word-break: break-all\" id=\"user-deploy-requests-apps-table-" + index + "-name\">" + value.name + "</td>";
      appRequestTable += statusCell;
      appRequestTable += "<td><button class=\"btn btn-info\" onclick=\"openModalAppDeploySetting("+index+","+ value.id + ","+ type +")\" ><i class=\"fa fa-cog\" aria-hidden=\"true\"></i>Deploy Config</button></td>";
      appRequestTable += "<td><button  class=\"btn btn-primary\" onclick=\"openModalAppsDeploySettingRequestSend("+index+","+value.id+")\" ><i class=\"fa fa-rocket\" aria-hidden=\"true\"></i>Send Request</button></td>";
      appRequestTable += stopCell;
      appRequestTable += "</tr>";
    });
    $("#user-deploy-requests-apps-table").append(appRequestTable);
    targetTableRow="user-deploy-requests-apps-table-row-";
    getAllAppsList();
    if (highlightEditedRow)
      setColorForRow("user-deploy-requests-apps-table","input-apps-deploy-setting-app");
      highlightEditedRow = false;
    }
   else if(whom=="user_request_deploy_settings") {
   $('#notice-manage-deploy-requests').html(data); 
   $('#notice-manage-deploy-requests').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   $("#modal-apps-deploy-setting-request-send").modal('toggle');
   appNumber = $("#input-apps-deploy-setting-request-send-app-number").val();
   $("#user-deploy-requests-apps-table-"+appNumber+"-status").html("Requested");
   $("#button-deploy-requests-stop-forwarding-"+appNumber).attr("disabled","true");
   }
  else if(whom=="admin_list_user_apps") {
    var deploy_status = "";
    var statusCell = "";
    var appTable = "";
    appTable += "<thead ><tr>";
    appTable += "<th style=\"width:30%\">App Name</th>";
    appTable += "<th style=\"width:15%\">User Name</th>";
    appTable += "<th style=\"width:15%\">Status</th>";
    appTable += "<th style=\"width:10%\">Environment</th>";
    appTable += "<th style=\"width:20%\">Requested At</th>";
    appTable += "<th style=\"width:10%\">Action</th>";
    appTable += "</tr></thead>";
    jQuery.each(data, function(index, value) {
      var ndate = formatDate(value.created_at);
      if(value.deploy_status==1) {
        deploy_status="Configured";
        statusCell = "<td><p class=\"cell-forwarding\">" + deploy_status + "</p></td>";
      }
      else if(value.deploy_status==2) {
        deploy_status="Waiting";
        statusCell = "<td><p class=\"cell-requested\">" + deploy_status + "</p></td>";
      }
      else if(value.deploy_status==9) {
        deploy_status="Cancelled";
        statusCell = "<td><p class=\"cell-cancelled\">" + deploy_status + "</p></td>";
      }
      else if(value.deploy_status==3) {
        deploy_status="Not Configured";
        statusCell = "<td><p class=\"cell-notforwarding\">" + deploy_status + "</p></td>";
      }
      else {
        deploy_status="Not Requested";
        statusCell = "<td><p class=\"cell-notrequested\">" + deploy_status + "</p></td>";
      }
      appTable += "<tr id=\"admin-show-user-apps-table-row-"+index+"\">";
      appTable += "<td style=\"word-break: break-all; width: 35%\" id=\"admin-show-user-apps-" + index + "-name\">" + value.name + "</td>";
      appTable += "<td>" + value.env+"</td>";
      appTable += statusCell;
      appTable += "<td>" + value.new_env +"</td>";
      appTable += "<td>" + ndate+"</td>";
      // appTable += "<td><button class=\"btn btn-info\" onclick=\"location.href = \'/admin/report_apps/"+value.id+"\'\" >Details</button></td>";
      appTable += "<td><button class=\"btn btn-info\" onclick=\"window.open(\'/admin/report_apps/"+value.id+"\')\" >Details</button></td>"; //open in new window
      appTable += "</tr>";
    });
    $("#admin-show-user-apps-table").append(appTable);
    getAllUserAppsList();
  }

   else if(whom=="admin_approve_user_app_deploy_request") {
   $('#notice-admin-report-apps').html(data);
   $('#notice-admin-report-apps').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
    $("#modal-apps-deploy-approve").modal("hide");
    // $("#modal-apps-deploy-approve").modal("toggle");
   }

   else if(whom=="admin_cancel_user_app_deploy_request") {
   $('#notice-admin-report-apps').html(data);
   $('#notice-admin-report-apps').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   $("#modal-apps-deploy-cancel").modal("toggle");
   }
   else if(whom=="admin_server_class_create") {
   $('#notice-server-class-create').html(data);
   $('#notice-server-class-create').css("display","block");
   //$("#modal-server-class-create").modal('toggle');     
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   }
   else if(whom=="user_validate_request_deploy_settings") {
   if ( data == 1 ) {
     $('#modal-apps-deploy-setting-request-send').modal('toggle');
   }
   else {
     displayNoticeElement("notice-manage-deploy-requests", "Please make sure you have made Deploy Settings. You cannot Request without applying Deploy Setting.");
   }
   }
   else if(whom=="user_request_stop_forwarding") {
   $('#modal-apps-deploy-setting-stop-forwarding').modal('toggle');
   $('#notice-manage-deploy-requests').html(data);
   $('#notice-manage-deploy-requests').css("display","block");
   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   $("#button-deploy-requests-stop-forwarding-"+$("#input-apps-deploy-setting-stop-forwarding-send-app-number").val()).attr("disabled","true");
   }
   else if(whom=="admin_deployment_app_create") {
   if ( data == "success" ) {
     displayNoticeElement("notice-server-class-create", "App Created Successfully!!! You May Create Server Class Now !");
     $("#button-server-class-create-deployment-app").attr("disabled","true");
   }
   else if (data == "wrongpassword")
   {
     displayNoticeElement("notice-server-class-create", "Failed. SSH login failed, please try to retype your username and password");
     $('#input-server-class-create-ssh-server-password').focus();
   }

   else if (data == "wrongpermission")
   {
     displayNoticeElement("notice-server-class-create", "Failed. Permission denied.\
    Please make sure these commands have been issued on deployment server and create again.<br>\
    chmod 777 /opt/splunk/etc/deployment-apps/<br>\
    find /opt/splunk/etc/deployment-apps/[app_name] -type d -exec chmod 777 {} \\; (if the app already exists)<br>\
    find /opt/splunk/etc/deployment-apps/Splunk_TA_nix_basic -type d -exec chmod 777 {} \\; (in case of unix app)<br>\
    find /opt/splunk/etc/deployment-apps/Splunk_TA_nix_basic/local -type f -exec chmod 666 {} \\; (in case of unix app)<br>\
    ");
   }

   else if (data == "errorbeforelogin")
   {
     displayNoticeElement("notice-server-class-create", "Failed. Error occured before SSH Login");
   }

   else 
   {
     displayNoticeElement("notice-server-class-create", "inputs.conf generated! But it may contain some issues, check inputs.conf manually.\n"+ "[Message] "+data);
     $("#button-server-class-create-deployment-app").attr("disabled","true");
   }
   }
   else if(whom=="anonymous_announcements_get") {
   var announcementData = "";
   jQuery.each(data, function(index, value) {
    var ndate = formatDate(value.created_at);
    announcementData += ndate + "   - " + value.announce + "<br>";
   });
   $("#div-users-login-announcements").html(announcementData);
   }
   else if(whom=="admin_populate_tags_server_class_modal") {
   //data is from get_tags(search_host,user), user is from get_tags, 
   //params[:user] is frompostData whom=admin_populate_tags_server_class_modal
   //label-report-apps-user-name is from report_app.html.erb
   var found = false;
   var existingStr = "";
   jQuery.each(data, function(index, value) { 
    tag_name = "tag_" + value.user.substring(5, value.user.length); //value.user is same each time
    if(value.name == tag_name){  
      found = true;
      $("#select-server-class-search-tags").append("<option selected=\"selected\">"+value.name+", host - "+value.host+"</option>");
      existingStr = value.host;
    }
    else
    {
      $("#select-server-class-search-tags").append("<option>"+value.name+", host - "+value.host+"</option>");
    }
   });
   if (!found) {
    $("#select-server-class-search-tags").append("<option selected=\"selected\">Tag not Found, Please Create It</option>");
    $("#input-server-class-create-search-tag").val(tag_name);
    $("#forwarder-list-div").show();
   }
   var finalWhiteList = "";
   existingList = existingStr.split(",");
   finalWhiteList = getFinalForwarderWhiteList(newWhiteList, existingList);
   $("#input-server-class-create-search-tag-hosts").val(finalWhiteList); //despite found no not, show new hosts
   }
   else if(whom=="admin_tag_create") {
   displayNoticeElement("notice-server-class-create", data);
   $("#create-tag-result-div").html(data);

   alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   }

   else if(whom=="user_log_size"){
    var sizeTable = "";
    sizeTable += "<thead><tr>";
    sizeTable += "<th>Service ID</th>";
    sizeTable += "<th>Host</th>";
    sizeTable += "<th>Approximate Size (MB)</th>";
    sizeTable += "</tr></thead>";
    totalSize = 0;

    if (data == null || data.length == 0) {
      sizeTable += "<td>" + "Failed. Please try again 30 seconds later!" + "</td>";
      $("#user-input-log-size-table").append(sizeTable);
      $("#size-loading-id").hide();
      return;
    }

    jQuery.each(data, function(index, value) {
      sizeTable += "<tr>";
      sizeTable += "<td>" + value.service_id + "</td>";
      sizeTable += "<td>" + value.h + "</td>";
      sizeTable += "<td>" + parseFloat(value.virtual_mb).toFixed(0) + "</td>";
      sizeTable += "</tr>";
      totalSize += parseFloat(value.virtual_mb);
    });

    totalSize = totalSize.toFixed(0);
    sizeTable += "<tr>";
    sizeTable += "<td>Total</td>";
    sizeTable += "<td></td>";
    sizeTable += "<td>" + totalSize + "</td>";
    sizeTable += "</tr>";

    totalLogSize = totalSize;
    $("#user-input-log-size-table").append(sizeTable);
    $("#size-loading-id").hide();
   }

   else if(whom=="user_log_storage"){
    var storageTable = "";
    storageTable += "<thead><tr>";
    storageTable += "<th>Service ID</th>";
    storageTable += "<th>Index Dir Name</th>";
    // storageTable += "<th>Percentage</th>";
    storageTable += "<th>Approximate Size (MB)</th>";
    storageTable += "</tr></thead>";
    totalSize = 0;

    if (data == null || data.length == 0) {
      storageTable += "<td>" + "Failed. Please try again 30 seconds later!" + "</td>";
      $("#user-input-log-storage-table").append(storageTable);
      $("#storage-loading-id").hide();
      $("#user-input-log-cost-table").append(storageTable);
      $("#cost-loading-id").hide();
      return;
    }

    jQuery.each(data, function(index, value) {
      storageTable += "<tr>";
      storageTable += "<td>" + value.service_id + "</td>";
      storageTable += "<td>" + value.index_dirname + "</td>";
      // storageTable += "<td>" + value.allocation_rate + "</td>";
      storageTable += "<td>" + parseFloat(value.virtual_mb).toFixed(0) + "</td>";
      storageTable += "</tr>";
      totalSize += parseFloat(value.virtual_mb);
    });

    totalSize = totalSize.toFixed(0);
    storageTable += "<tr>";
    storageTable += "<td>Total</td>";
    storageTable += "<td></td>";
    storageTable += "<td>" + totalSize + "</td>";
    storageTable += "</tr>";

    totalStorageSize = totalSize;
    $("#user-input-log-storage-table").append(storageTable);
    $("#storage-loading-id").hide();

    if (totalLogSize == 0 || totalStorageSize == 0) {
      costTable += "<td>" + "Failed. Please try again 30 seconds later!" + "</td>";
      $("#user-input-log-cost-table").append(costTable);
      $("#cost-loading-id").hide();
      return;
    }
    var costTable = "";
    var totalLogSizeGB = (totalLogSize / 1024).toFixed(3);
    var totalStorageSizeGB = (totalStorageSize / 1024).toFixed(3);
    var totalPrice = (totalLogSizeGB * serviceUnitPrice + totalStorageSizeGB * storageUnitPrice).toFixed(0);
    costTable += "<thead><tr>";
    costTable += "<th>Type</th>";
    costTable += "<th>Size (GB)</th>";
    costTable += "<th>Unit Price (Yen / GB Monthly)</th>";
    costTable += "<th>Price (Yen)</th>";
    costTable += "</tr></thead>";

    costTable += "<tr>";
    costTable += "<td>Service charge</td>";
    costTable += "<td>" + totalLogSize + " / " + 1024 + " = " + totalLogSizeGB + "</td>";
    costTable += "<td>" + serviceUnitPrice + "</td>";
    costTable += "<td>" + (totalLogSizeGB * serviceUnitPrice).toFixed(0) + "</td>";
    costTable += "</tr>";

    costTable += "<tr>";
    costTable += "<td>Storage charge</td>";
    costTable += "<td>" + totalStorageSize + " / " + 1024 + " = " + totalStorageSizeGB + "</td>";
    costTable += "<td>" + storageUnitPrice + "</td>";
    costTable += "<td>" + (totalStorageSizeGB * storageUnitPrice).toFixed(0) + "</td>";
    costTable += "</tr>";
    
    costTable += "<tr>";
    costTable += "<td>Total</td>";
    costTable += "<td></td>";
    costTable += "<td></td>";
    costTable += "<td>" + totalPrice + "</td>";
    costTable += "</tr>";

    $("#user-input-log-cost-table").append(costTable);
    $("#cost-loading-id").hide();
   }
}

function failPostData(whom,data)
{
   if(whom=="adminusersaccountscancel") {
   $('#user-account-wait').css("display","none");
   document.getElementById("adminusersaccountscancel").style.display = "none";
   document.getElementById("adminusersaccountsapprove").style.display = "none";
   $('#user-account-fail').css("display","block");
   }
   else if(whom=="adminusersaccountsapprove") {
   $('#user-account-wait').css("display","none");
   document.getElementById("adminusersaccountscancel").style.display = "none";
   document.getElementById("adminusersaccountsapprove").style.display = "none";
   $('#user-account-fail').css("display","block");
   }
   else if(whom=="adminusersinputscancel") {
   $('#inputs-account-wait').css("display","none");
   document.getElementById("adminusersinputscancel").style.display = "none";
   document.getElementById("adminusersinputsapprove").style.display = "none";
   $('#inputs-account-fail').css("display","block");
   }
   else if(whom=="adminusersinputsapprove") {
   $('#inputs-account-wait').css("display","none");
   document.getElementById("adminusersinputscancel").style.display = "none";
   document.getElementById("adminusersinputsapprove").style.display = "none";
   $('#inputs-account-fail').css("display","block");
   }
   else if(whom=="get_profile") {
   }
   else if(whom=="reset_password_validate_user") {
   }

   else if(whom=="") {
   }
}