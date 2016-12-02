function getForwardersFromDeploymentServerSet(data){
  $("#modal-forwarder-add-from-deployment-server-table").append("<thead > <tr><th><input type=\"checkbox\" onclick=\"changeCheckBoxStatus(this,\'modal-fafds-table-check\')\" id =\"modal-fafds-table-check-all\"/></th><th>Forwarder</th></thead>");
  jQuery.each(data, function(index, value) {
   $("#modal-forwarder-add-from-deployment-server-table").append("<tr id=\"modal-forwarder-add-from-deployment-server-table-row-"+index+"\"> <td> <input type=\"checkbox\" class=\"modal-fafds-table-check\" value=\""+value+"\"/></td><td id=\"modal-forwarder-add-from-deployment-server-table-"+index+"-forwarder-name\">"+value+"</td></tr>");
  });
  targetTableRow = "modal-forwarder-add-from-deployment-server-table-row-"
  getAllForwardersList();
}

function getForwardersSet(data){
  var forwarderTable = "";
  forwarderTable += "<thead id=\"user-forwarders-table-head\">";
  forwarderTable += "<tr id=\"user-forwarders-table-row\">";
  forwarderTable += "<th style=\"width: 40%\">Forwarder</th>";
  forwarderTable += "<th style=\"width: 30%\">Date</th>";
  forwarderTable += "<th style=\"width: 30%\">Delete</th>";
  forwarderTable += "</tr></thead>";
  if (data.length == 0 ) {
    displayNoticeElement( "notice-manage-forwarders", "No Data Available Currently. Please Input Some Data First." );
  }
  
  jQuery.each(data, function(index, value) {
    var ndate=formatDate(value.created_at);
    forwarderTable += "<tr name=\""+value.id+"\"id=\"user-forwarders-table-row-"+index+"\">";
    forwarderTable += "<td id=\"user-forwarders-"+index+"-name\">"+ value.name +"</td>";
    forwarderTable += "<td class=\"user-forwarders-table-date\">"+ ndate +"</td>";
    forwarderTable += "<td> <button  class=\"btn btn-danger\" onclick=\"openModalForwarderDelete("+index+","+ value.id +")\" ><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i>Delete</button></td>";
    forwarderTable += "</tr>";
  });
  $("#user-forwarders-table").append(forwarderTable);
  targetTableRow = "user-forwarders-table-row-";
  getAllUserForwardersList();

  if (highlightAddedRow)
  {
    setColorForRow("user-forwarders-table", "forwarder-add");
    highlightAddedRow = false;
  }
}

function getForwardersFromServerClassSet(data){
  regexBreakPoint = data.indexOf("regex")
  regex = data.splice(regexBreakPoint)
  regex = regex.splice(1)
  $("#input-server-class-show-regex").val(regex[0]);
  $("#modal-user-server-class-show-table").append("<thead > <tr><th style=\"width: 10%\">Forwarder</th></thead>");
  jQuery.each(data, function(index, value) {
   $("#modal-user-server-class-show-table").append("<tr> <td>"+value+"</td></tr>");
  });
}

function deleteForwarderSet(data){
  if(data == 1) {
     displayNoticeElement("notice-manage-forwarders","Forwarder deleted successfully !!!");
     alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
     forwarderNumber=$("#input-forwarder-delete-forwarder-number").val();
     $($("#user-forwarders-"+forwarderNumber+"-name").parent()).remove();
  }
  else if (data == 2) {
     displayNoticeElement("notice-manage-forwarders","There seems to be some problem, Please Try Again Later or Contact Admins !!!");
     alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
  }
  else if (data == 0) {
     displayNoticeElement("notice-manage-forwarders","There seems to be some problem, Please Try Again Later or Contact Admins !!!");
     alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
  }
  else if (data == -1) {
     displayNoticeElement("notice-manage-forwarders","This Forwarder is Associated with some Server Class, Please update the Server Class before you delete the Forwarder!!!");
     alertNoticesTimeoutVar = clearAlertNotices();
    if (alertNoticesTimeoutVar != -1) {
    clearTimeout(alertNoticesTimeoutVar);
    alertNoticesTimeoutVar = clearAlertNotices();
    }
   }
  $('#modal-forwarder-delete').modal('toggle');
}

function getForwarderCountSet(data){
  if (data==0) {
    window.alert("Please Add Forwarders Before Setting up New Input");
    link="/?env="+$("#hidden-text-env").val();
    window.location.href=link;
   }
}
