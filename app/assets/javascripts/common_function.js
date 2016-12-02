function clearNotices(ele) {
	timeoutValue = setTimeout( function() {
		 ele.className = "";
	 }, 6000);
	return(timeoutValue);
}

//improved search bar, can search any column in the table. use table1 and table2 for 2types of inputs
function doSearch(elem, table1, table2, table3) { 
	console.log("in");
	var searchText = $(elem).val();
	var tables = new Array(table1,table2, table3);
	for (var i = 0; i < tables.length; i++) {
	if (tables[i] == "" || tables[i] == null) {
		continue;
	}
	$targetTable = document.getElementById(tables[i]);
	var targetTableColCount;
	//Loop through table rows
	for (var rowIndex = 0; rowIndex < $targetTable.rows.length; rowIndex++) {
	var rowData = '';

	//Get column count from header row
	if (rowIndex == 0) {
		targetTableColCount = $targetTable.rows.item(rowIndex).cells.length;
		continue; //do not execute further code for header row.
	}
	//Process data rows. (rowIndex >= 1)
	for (var colIndex = 0; colIndex < targetTableColCount; colIndex++) {
		rowData += $targetTable.rows.item(rowIndex).cells.item(colIndex).textContent;
	}
	rowData = rowData.toLowerCase();
	searchText = searchText.toLowerCase();
	//If search term is not found in row data, then hide the row, else show
	if (rowData.indexOf(searchText) == -1)
		$targetTable.rows.item(rowIndex).style.display = 'none';
	else
		$targetTable.rows.item(rowIndex).style.display = 'table-row';
	}
	};
}

function setColorForRow(table, elem)
{
	var target_table = document.getElementById("non-exist");
	var source_add = false;
	var largest_id = -1;

	if (elem == "input-add") { //find the the row whose name(id) is largest.
		source_add = true;
		log = $("#add-input-log-radio").is(":checked");
		script = $("#add-input-script-radio").is(":checked");
		unixapp = $("#add-input-unixapp-radio").is(":checked");
		$("#add-input-log-radio").prop("checked", false);
		$("#add-input-script-radio").prop("checked", false);
		$("#add-input-unixapp-radio").prop("checked", false);
		if (log == true)
		{
			target_table = document.getElementById("user-inputs-table");
		}
		else if (script == true){
			target_table = document.getElementById("user-inputs-script-table");
		}
		// else if(unixapp)
		// {
		//  target_table = document.getElementById("user-inputs-unixapp-table");
		// }
		else return;
	}
	else if (elem == "app-add") {
		source_add = true;
		target_table = document.getElementById("user-apps-table");
		name=$("#input-apps-add-name").val();
		$("#input-apps-add-name").val("");
		if (name == "") { //if no new app added
			return;
		}
	}
	else if(elem == "serverclass-add"){
		source_add = true;
		target_table = document.getElementById("user-server-class-table");
		name=$("#input-server-class-add-name").val();
		$("#input-server-class-add-name").val("");
		if (name == "") { //if no new serverclass added
			return;
		}
	}
	else if(elem == "forwarder-add"){ //forwarders are seperated by |. e.g. abc|def
		source_add = true;
		target_table = document.getElementById("user-forwarders-table");
		names=$("#input-forwarder-add-from-deployment-server-forwarder-names").val();
		$("#input-forwarder-add-from-deployment-server-forwarder-names").val("");
		if (names == "") { //if no new forwarder added
			return;
		}
		cnt = names.split("|").length; //count of new added forwarders
		var ids = [];
		var rows = target_table.getElementsByTagName("tr"); 
		for(i = 1; i < rows.length; i++){
			idx = rows[i].outerHTML.indexOf("name=\"");
			end_idx = rows[i].outerHTML.indexOf("\"", idx + 6);
			id_str = rows[i].outerHTML.substring(idx + 6, end_idx);
			id = parseInt(id_str);
			ids.push(id);
		}
		ids.sort(function(a, b){return b-a}); //descending order

		for(i = 1; i < rows.length; i++){
			for (j = 0; j < cnt; j++)
			{
				largest_id_str = "name=\""+ ids[j].toString() + "\"";
				if(id != "" && rows[i].outerHTML.includes(largest_id_str)) //name is set as id of each source,e.g. input id, app id, if use title=, the id will show when hover
				{
					rows[i].className = "edited";
					clearNotices(rows[i]);
				}
			}
		}
		return;
	}

	if (source_add) {
		var rows = target_table.getElementsByTagName("tr"); 
		for(i = 1; i < rows.length; i++){
			idx = rows[i].outerHTML.indexOf("name=\"");
			end_idx = rows[i].outerHTML.indexOf("\"", idx + 6);
			id_str = rows[i].outerHTML.substring(idx + 6, end_idx);
			id = parseInt(id_str);
			if(id > largest_id)
			{
				largest_id = id;
			}
		}
		largest_id_str = "name=\""+ largest_id.toString() + "\"";
		for(i = 1; i < rows.length; i++){
			if(id != "" && rows[i].outerHTML.includes(largest_id_str)) //name is set as id of each source,e.g. input id, app id, if use title=, the id will show when hover
			{
				rows[i].className = "edited";
				clearNotices(rows[i]);
			}
			else{
				rows[i].className = "";
			}
		}
	}
	else{ //source edit
		id = $("#"+elem).val();
		target_table = document.getElementById(table);
		var rows = target_table.getElementsByTagName("tr"); 
		var id_str = "name=\""+ id + "\"";
		for(i = 1; i < rows.length; i++){
			if(id != "" && rows[i].outerHTML.includes(id_str)) //name is set as id of each source,e.g. input id, app id, if use title=, the id will show when hover
			{
				rows[i].className = "edited";
				clearNotices(rows[i]);
			}
			else{
				rows[i].className = "";
			}
		}
	}
}

function displayNoticeElement( noticeElement, withThis ) {
	updateElementHtmlData( noticeElement, withThis );
	$("#"+noticeElement).css("display","block");
}

var alertNoticesTimeoutVar = -1;
var lookBackwardAlertNoticesTimeoutVar = 0;
function clearAlertNotices() {
	timeoutValue = setTimeout( function() {
		listOfNotices = $("div[id^='notice-']:visible");
		$.each(listOfNotices, function(index,value){
			$(value).css("display","none");
		});
		clearTimeout(alertNoticesTimeoutVar);
		alertNoticesTimeoutVar = -1;
	}, 6000);
	return(timeoutValue);
}

function changeCheckBoxStatus(checkBoxElem,checkBoxClass)
{
	if(checkBoxElem.checked == true ) {
		$("."+checkBoxClass+":visible").prop('checked',true);
	}
	else if (checkBoxElem.checked == false) {
		$("."+checkBoxClass+":visible").prop('checked',false);     
	}
}

function formatDate(fdate)
{
	fyear = fdate.substr(0,4);
	fmon = fdate.substr(0,7);
	fmon = fmon.substr(5);
	fday = fdate.substr(8);
	fday = fday.substr(0,2);
	ftime = fdate.substr(11,8)
	ndate = fyear + "-" + fmon + "-" + fday + " " + ftime;
	return(ndate);
}

function formatCrcSalt (src){
	if(src == null) return "";
	des = src.replace("<","&lt;");
	des = des.replace(">","&gt;");
	return des;
}

function callSplunkRestApi()
{
	ajaxCall('testingrest');
}

function changePassword()
{
	ajaxCall("change_password");
}

function removeThisElementChildren(elem)
{
	child=$(elem).children();
	for (i=0;i<child.length;i++)
	{
		$(child[i]).remove();
	}
}

function updateEmailAddress()
{
	text1=1;
	text2=validate($('#input-text-email-edit-group-name').val(),'string','groupname');
	text3=validate($('#input-text-email-edit-app-team-name').val(),'string','appteamname');
	text4=validate($('#input-text-email-edit-service-id').val(),'integer','serviceid');
	text5=validate($('#input-text-email-edit-email-id').val(),'string','email');
	text6=validate($('#input-text-email-edit-email-for-emergency').val(),'string','emailemergency');
	if(text1==1)
	{
	$('#alert-modal-email-edit-confirm').css("display","none");
	if(text2==1)
	{
		$('#alert-modal-email-edit-confirm').css("display","none");
		if(text3==1)
		{
		$('#alert-modal-email-edit-confirm').css("display","none");
		if(text4==1)
		{
			$('#alert-modal-email-edit-confirm').css("display","none");
			if(text5==1)
			{
			$('#alert-modal-email-edit-confirm').css("display","none");
			if(text6==1)
			{
				 $('#alert-modal-email-edit-confirm').css("display","none");
				 ajaxCall("edit_email_address");
				 $('#modal-email-edit').modal('toggle');
			}
			else
			{
				$('#alert-modal-email-edit-confirm').css("display","block");
				with_this=getDisplayMessages('email',text6);
				updateElementHtmlData('alert-modal-email-edit-confirm',with_this);
				$('#input-text-email-edit-email-for-emergency').focus();
			}
			}
			else
			{
			$('#alert-modal-email-edit-confirm').css("display","block");
			with_this=getDisplayMessages('email',text5);
			updateElementHtmlData('alert-modal-email-edit-confirm',with_this);
			$('#input-text-email-edit-email-id').focus();
			}
		}
		else
		{
			$('#alert-modal-email-edit-confirm').css("display","block");
			with_this=getDisplayMessages('serviceid',text4);
			updateElementHtmlData('alert-modal-email-edit-confirm',with_this);
			$('#input-text-email-edit-service-id').focus();
		}
		}
		else
		{
		$('#alert-modal-email-edit-confirm').css("display","block");
		with_this=getDisplayMessages('appteamname',text3);
		updateElementHtmlData('alert-modal-email-edit-confirm',with_this);
		$('#input-text-email-edit-app-team-name').focus();
		}
	}
	else
	{
		$('#alert-modal-email-edit-confirm').css("display","block");
		with_this=getDisplayMessages('groupname',text2);
		updateElementHtmlData('alert-modal-email-edit-confirm',with_this);
		$('#input-text-email-edit-group-name').focus();
	}
	}
}

function updateElementHtmlData(where,with_this)
{
	where="#"+where;
	$(where).html(with_this);
}


function restoreRecordsDisplay()
{
	$.each(listNotMatchingNames, function(index,value){
		$("#"+targetTableRow+value).css("display","table-row");
	});
}