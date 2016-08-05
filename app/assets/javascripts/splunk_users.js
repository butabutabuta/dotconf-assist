var highlightEditedRow = false;
var highlightAddedRow = false;
var pageSpecificSearchBox;
$(document).keypress(function(e){
	if(e.which == 47) {
	$("#"+pageSpecificSearchBox).focus();
	}
});

function clearNotices(ele) {
	timeoutValue = setTimeout( function() {
		 ele.className = "";
	 }, 6000);
	return(timeoutValue);
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

//improved search bar, can search any column in the table. use table1 and table2 for 2types of inputs
function doSearch(elem, table1, table2, table3) { 
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

function formatCrcSalt (src){
	if(src == null) return "";
	des = src.replace("<","&lt;");
	des = des.replace(">","&gt;");
	return des;
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

function adminUsersAccountsCancel()
{
	$('#user-account-wait').css("display","block");
	ajaxCall('adminusersaccountscancel');
}

function adminUsersAccountsApprove()
{
	$('#user-account-wait').css("display","block");
	ajaxCall('adminusersaccountsapprove');
}

function adminUsersInputsCancel()
{
	$('#inputs-account-wait').css("display","block");
	ajaxCall('adminusersinputscancel');
}

function adminUsersInputsApprove()
{
	$('#inputs-account-wait').css("display","block");
	ajaxCall('adminusersinputsapprove');
}

function adminUsersInputsGenerateConf()
{
	ajaxCall('generateconf');
}

function callSplunkRestApi()
{
	ajaxCall('testingrest');
}
function adminUsersInputsGenerate()
{
	var url="/admin/generateconf?id="+$('#adminusersinputsgenerate').attr('value');
	window.open(url, '_blank');
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

function getThisData(for_this,from_this,in_this)
{
	if(for_this!='')
		in_this=in_this+for_this+"=";
	from_this="#"+from_this;
	in_this=in_this+ $(from_this).val();
	return(in_this);
}

function validate(text,type,for_this)
{
	if(type=="string") {
		result=validate_string(text,for_this);
	}
	else if(type=="integer") {
		result=validate_integer(text,for_this);
	}
	else{
	}
	return(result);
}

function validate_integer(text,for_this)
{
	result=0;
	if(for_this=="serviceid") {
		result=validateIntegerServiceID(text);
	}
	return(result);
}

function validateIntegerServiceID(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text.length<2) {
		return(-2);
	}
	else if(isNaN(text)) {
		return(-3);
	}
	return(result);
}

function validate_string(text,for_this)
{
	result=1;
	if(for_this=="username") {
		result=validateStringUserName(text);
	}
	else if(for_this=="groupname") {
		result=validateStringGroupName(text);
	}
	else if(for_this=="appteamname") {
		result=validateStringAppTeamName(text);
	}
	else if(for_this=="rpaasusername") {
		result=validateStringRpaasUserName(text);
	}
	else if(for_this=="memo") {
		//result=validateStringMemo(text);
	}
	else if(for_this=="logfilepath") {
		result=validateStringLogFilePath(text);
	}
	else if(for_this=="interval") {
		result=validateStringInterval(text);
	}
	else if(for_this=="scriptname") {
		result=validateStringScriptname(text);
	}
	else if(for_this=="option") {
		result=validateStringOption(text);
	}
	else if(for_this=="sourcehostname") {
		result=validateStringSourceHostname(text);
	}
	else if(for_this=="sourcetype") {
		result=validateStringSourcetype(text);
	}
	else if(for_this=="filetype") {
		result=validateStringFileType(text);
	}
	else if(for_this=="filename") {
		result=validateStringFileName(text);
	}
	else if(for_this=="email") {
		result=validateStringEmail(text);
	}
	else if(for_this=="password")
	{
	result=validateStringPassword(text);
	}
	else if(for_this=="passwordconfirm")
	{
	result=validateStringPasswordConfirm(text);
	}
	else if(for_this=="passwordsplunkaccount")
	{
	result=validateStringPasswordSplunkAccount(text);
	}
	else if(for_this=="serverclassname")
	{
	result=validateStringServerClassName(text);
	}
	else if(for_this=="deployappname")
	{
	result=validateStringDeployAppName(text);
	}
	else if(for_this=="serverclassregex")
	{
	result=validateStringServerClassRegex(text);
	}
	else if(for_this=="emailemergency") {
		result=validateStringEmailEmergency(text);
	}
	else {
	}
	return(result);
}

function validateStringUserName(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text.length==5) {
		return(0);
	}
	else if(text.length<7) {
		return(-2);
	}
	else if(text=="") {
	}
	return(result);
}

function validateStringGroupName(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text.length<2) {
		return(-2);
	}
	else if(text=="") {
	}
	return(result);
}

function validateStringAppTeamName(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text.length<2) {
		return(-2);
	}
	else if(text=="") {
	}
	return(result);
}

function validateStringRpaasUserName(text)
{
	result=1;
	/*if(text=="") {
		return(0);
	}
	else if(text.length<2) {
		return(-2);
	}
	else if(text=="") {
	}*/
	return(result);
}

function validateStringMemo(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text.length<2) {
		return(-2);
	}
	else if(text=="") {
	}
	return(result);
}

function validateStringLogFilePath(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text.length<2) {
		return(-2);
	}
	else if(text=="") {
	}
	return(result);
}

function validateStringInterval(text)
{
	result=1;
	if(text=="") {
		return(-1);
	}
	return(result);
}

function validateStringScriptname(text)
{
	result=1;
	if(text=="") {
		return(-1);
	}
	return(result);
}

function validateStringOption(text)
{
	result=1;
	return(result);
}

function validateStringSourceHostname(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text.length<2) {
		return(-2);
	}
	else if(text=="") {
	}
	return(result);
}

function validateStringSourcetype(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text.length<2) {
		return(-2);
	}
	else if(text=="") {
	}
	return(result);
}

function validateStringFileName(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text.length<5) {
		return(-2);
	}
	else if(text=="") {
		return(-1);
	}
	return(result);
}

function validateStringFileType(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text.length<2) {
		return(-2);
	}
	else if(text=="") {
		return(-1);
	}
	return(result);
}

function validateStringEmail(text)
{
	result=1;
	if(text=="") {
		return(-1);
	}
	else if(text.length<3) {
		return(-2);
	}
	else if(text!="") {
		//var regex = /^[a-zA-Z][a-zA-Z]*\.[a-zA-Z][a-zA-Z]*$/;
		//var regex = /^[a-zA-Z][\.*[a-zA-Z]*\.[a-zA-Z][a-zA-Z]*]*$/;
		//var regex = /^[a-zA-Z][\-*\.*[a-zA-Z]*[\.\-][a-zA-Z][a-zA-Z]*]*$/;
		var regex = /^[a-zA-Z][\-*\.*[a-zA-Z]*[\.\-][a-zA-Z][a-zA-Z]*]*@[a-zA-Z\.][a-zA-Z\.]*$/;
		if(!regex.test(text))
		{
		var regex = /^[a-zA-Z][\-*\.*[a-zA-Z]*[\.\-][a-zA-Z][a-zA-Z]*]*$/;
		//if((text.indexOf('@'))==-1)
		if(regex.test(text))
		{
			 return(-4);
		}
		return(-3);
		}
	}
	else if(text=="") {
		return(-1);
	}
	return(result);
}

function validateStringPassword(text)
{
	result=1;
	if(text=="")
	{
		return(-1);
	}
	else if(text.length<4)
	{
		return(-2);
	}
	return(result);
}

function validateStringPasswordConfirm(text)
{
	result=1;
	if(text=="")
	{
	return(-1);
	}
	else if(text!=$('#password').val())
	{
		 return(-1);
	}
	return(result);
}

function validateStringPasswordSplunkAccount(text)
{
	result=1;
	if(text=="")
	{
		return(-1);
	}
	else if(text.length<4)
	{
		return(-2);
	}
	else
	{
	}
	return(result);
}

function validateStringServerClassName(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text.length<2) {
		return(-2);
	}
	else if(text=="") {
	}
	return(result);
}

function validateStringDeployAppName(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text.length<2) {
		return(-2);
	}
	else if(text=="") {
	}
	return(result);
}

function validateStringServerClassRegex(text)
{
	result=1;
	if(text=="") {
		return(0);
	}
	else if(text=="") {
	}
	return(result);
}

function validateStringEmailEmergency(text)
{
	result=1;
	if(text=="") {
		return(1);
	}
	else if(text.length<3) {
		return(-2);
	}
	else if(text!="") {
		//var regex = /^[a-zA-Z][a-zA-Z]*\.[a-zA-Z][a-zA-Z]*$/;
		//var regex = /^[a-zA-Z][\.*[a-zA-Z]*\.[a-zA-Z][a-zA-Z]*]*$/;
		//var regex = /^[a-zA-Z][\-*\.*[a-zA-Z]*[\.\-][a-zA-Z][a-zA-Z]*]*$/;
		var regex = /^[a-zA-Z][\-*\.*[a-zA-Z]*[\.\-][a-zA-Z][a-zA-Z]*]*@[a-zA-Z\.][a-zA-Z\.]*$/;
		if(!regex.test(text))
		{
		var regex = /^[a-zA-Z][\-*\.*[a-zA-Z]*[\.\-][a-zA-Z][a-zA-Z]*]*$/;
		//if((text.indexOf('@'))==-1)
		if(regex.test(text))
		{
			 return(-4);
		}
		return(-3);
		}
	}
	else if(text=="") {
		return(-1);
	}
	return(result);
}

function getDisplayMessages(whom,message_id)
{
	mid=message_id;
	result="";
	if(whom=="username") {
		result=getDisplayMessagesUserName(mid);
	}
	else if(whom=="groupname") {
		result=getDisplayMessagesGroupName(mid);
	}
	else if(whom=="appteamname") {
		result=getDisplayMessagesAppTeamName(mid);
	}
	else if(whom=="rpaasusername") {
		result=getDisplayMessagesRpaasUserName(mid);
	}
	else if(whom=="memo") {
		result=getDisplayMessagesMemo(mid);
	}
	else if(whom=="blacklist"){
		result=getDisplayMessagesBlacklist(mid);
	}
	else if(whom=="interval"){
		result=getDisplayMessagesInterval(mid);
	}
	else if(whom=="scriptname"){
		result=getDisplayMessagesScriptname(mid);
	}
	else if(whom=="unixapp"){
		result=getDisplayMessagesUnixApp(mid);
	}
	else if(whom=="option"){
		result=getDisplayMessagesOption(mid);
	}
	else if(whom=="serviceid") {
		result=getDisplayMessagesServiceID(mid);
	}
	else if(whom=="logfilepath") {
		result=getDisplayMessagesLogFilePath(mid);
	}
	else if(whom=="sourcehostname") {
		result=getDisplayMessagesSourceHostname(mid);
	}
	else if(whom=="sourcetype") {
		result=getDisplayMessagesSourcetype(mid);
	}
	else if(whom=="email") {
		result=getDisplayMessagesEmail(mid);
	}
	else if(whom=="filename") {
		result=getDisplayMessagesFileName(mid);
	}
	else if(whom=="filetype") {
		result=getDisplayMessagesFileType(mid);
	}
	else if(whom=="password") {
	result=getDisplayMessagesPassword(mid);
	}
	else if(whom=="passwordconfirm") {
	result=getDisplayMessagesPasswordConfirm(mid);
	}
	else if(whom=="passwordsplunkaccount") {
	result=getDisplayMessagesPasswordSplunkAccount(mid);
	}
	else if(whom=="serverclassname") {
	result=getDisplayMessagesServerClassName(mid);
	}
	else if(whom=="deployappname") {
	result=getDisplayMessagesDeployAppName(mid);
	}
	else if(whom=="serverclassregex") {
	result=getDisplayMessagesServerClassRegex(mid);
	}
	else {
		result="undefined";
	}
	return(result);
}

function getDisplayMessagesUserName(mid)
{
	if(mid==-1) {
		return("This Field Cannot be Blank");
	}
	else if(mid==-2) {
		return("The length has to be greater than 7");
	}
	else if(mid==1) {
		return("User Name is Valid");
	}
	else if(mid==0) {
		return("This user name will be used for Splunk account as well. Group name / Service name / Project name is better");
	}
	else if(mid==-400) {
		return("This User Name is already used, Please Select another name");
	}
	else if(mid==-401) {
		return("This User Name does NOT exist, Please provide Correct User Name");
	}
}

function getDisplayMessagesGroupName(mid)
{
	if(mid==-1) {
		return("This Field Cannot be Blank");
	}
	else if(mid==-2) {
		return("The length has to be greater than 2");
	}
	else if(mid==1) {
		return("Group Name is Valid");
	}
	else if(mid==0) {
		return("Your group name");
	}
}

function getDisplayMessagesAppTeamName(mid)
{
	if(mid==-1) {
		return("This Field Cannot be Blank");
	}
	else if(mid==-2) {
		return("The length has to be greater than 2");
	}
	else if(mid==1) {
		return("App Team Name is Valid");
	}
	else if(mid==0) {
		return("It will be used for contacting to this account. If you don't have app team, input sys team name.");
	}
}

function getDisplayMessagesRpaasUserName(mid)
{
	if(mid==-1) {
		return("This Field Cannot be Blank");
	}
	else if(mid==-2) {
		return("The length has to be greater than 2");
	}
	else if(mid==1) {
		return("RPaas User Name is Valid");
	}
	else if(mid==0) {
		return("Please input your deploy name if you are RPaaS user and you'd like to forward the logs to Splunk");
	}
}

function getDisplayMessagesMemo(mid)
{
	if(mid==-1) {
		return("This Field Cannot be Blank");
	}
	else if(mid==-2) {
		return("The length has to be greater than 2");
	}
	else if(mid==0) {
		return("Memo is Valid");
	}
	else if(mid==1) {
		return("Please Enter Memo (extra comments)");
	}
}

function getDisplayMessagesServiceID(mid)
{
	if(mid==-1) {
		return("This Field Cannot be Blank");
	}
	else if(mid==-2) {
		return("The length has to be greater than 2");
	}
	else if(mid==-3) {
		return("Please use Integers");
	}
	else if(mid==1) {
		return("Service ID is Valid");
	}
	else if(mid==0) {
		return("It will be used for allocating cost of PROD environment.");
	}
}

function getDisplayMessagesLogFilePath(mid)
{
	if(mid==-1) {
		return("This Field Cannot be Blank");
	}
	else if(mid==-2) {
		return("The length has to be greater than 2");
	}
	else if(mid==1) {
		return("Log File Path is Valid");
	}
	else if(mid==0) {
		return("You can use wildcard. (e.g. /usr/local/apache/logs/*) You can also white and black list. If you want to use them, please describe details on memo space.");
	}
}

function getDisplayMessagesBlacklist(mid)
{
	return ("Leave blank if you don't need blacklist or you set blacklist via checkbox");
}

function getDisplayMessagesOption(mid)
{
	return ("You can specify options for the script if needed. (e.g. -h localhost -u root)");
}

function getDisplayMessagesInterval(mid)
{
	if(mid==-1) {
	 return("This field cannot be blank");
	}
	else if(mid==0) {
	return ("Please specify how often to execute the script (in seconds)(e.g. 60), or a valid cron schedule. (e.g. 30 18 * * *)");
	}
}

function getDisplayMessagesUnixApp(mid)
{
	if(mid==-1) {
	 return("Please select at least one input");
	}
}

function getDisplayMessagesScriptname(mid)
{
	if(mid==-1) {
	 return("Either script name or script file cannot be empty");
	}
	else if(mid==0) {
	return ("You can change the script name without reuploading the file. This field will be ignored if you upload a new file");
	}
}

function getDisplayMessagesSourceHostname(mid)
{
	 if(mid==-1) {
		return("This Field Cannot be Blank");
	 }
	 else if(mid==-2) {
		return("The length has to be greater than 2");
	 }
	 else if(mid==1) {
		return("SourceHostname is Valid");
	 }
	 else if(mid==0) {
		return("It's your Splunk Web (SH) hostname. Please ask admin if you have dedicated SH.");
	 }
}

function getDisplayMessagesSourcetype(mid)
{
	 if(mid==-1) {
		return("This Field Cannot be Blank");
	 }
	 else if(mid==-2) {
		return("The length has to be greater than 2");
	 }
	 else if(mid==1) {
		return("Sourcetype is Valid");
	 }
	 else if(mid==0) {
		return("Please input sourcetype. If you don't have to set specific sourcetype, please input \"auto\".");
	 }
}
/**
* Following Function is a classification of displayMessages function
* It displays messages for 'Email's
* mid is the message ID, 1 means perfect while negative ids means some error occured
*/
function getDisplayMessagesEmail(mid)
{
	 if(mid==-1) {
		return("This Field Cannot be Blank");
	 }
	 else if(mid==-2) {
		return("The length has to be greater than 3");
	 }
	 else if(mid==-3) {
		return("Email has to be in following format => name.surname@domain or name-surname@domain");
	 }
	 else if(mid==-4) {
		return("Do not forget to add @domain");
	 }
	 else if(mid==1) {
		return("Email is Valid");
	 }
	 else if(mid==0) {
		return("It will be used for Information announce");
	 }
}
/**
* Following Function is a classification of displayMessages function
* It displays messages for 'FileName's
* mid is the message ID, 1 means perfect while negative ids means some error occured
*/
function getDisplayMessagesFileName(mid)
{
	 if(mid==-1) {
		return("This Field Cannot be Blank");
	 }
	 else if(mid==-2) {
		return("The length has to be greater than 5");
	 }
	 else if(mid==1) {
		return("File Name is Valid");
	 }
	 else if(mid==0) {
		return("Please Input File Name for the File you will be Uploading");
	 }
}
/**
* Following Function is a classification of displayMessages function
* It displays messages for 'Email's
* mid is the message ID, 1 means perfect while negative ids means some error occured
*/
function getDisplayMessagesFileType(mid)
{
	 if(mid==-1) {
		return("This Field Cannot be Blank");
	 }
	 else if(mid==-2) {
		return("The length has to be greater than 2");
	 }
	 else if(mid==1) {
		return("File Type is Valid");
	 }
	 else if(mid==0) {
		return("Please Input File Type for the File you will be Uploading");
	 }
}
/**
* Classification of display message for String
* Display messages in popover for the Password while requesting Account
*
*/
function getDisplayMessagesPassword(mid)
{
	 if(mid==-1) {
	 return("Enter your Password");
	 }
	 if(mid==-2) {
	 return("Length of the Password cannot be less than 4");
	 }
	 else if(mid==1) {
	 return("Password is Valid");
	 }
}
/**
* Classification of display message for String
* Display messages in popover for the Password Confirm while requesting account
*
*/
function getDisplayMessagesPasswordConfirm(mid)
{
	 if(mid==-1) {
	 return("Password needs to match");
	 }
	 else if(mid==1) {
	 return("Password is Valid");
	 }
}
/**
* Classification of display message for String
* Display messages in popover for the Password while creating Account on SPLUNK SH
*
*/
function getDisplayMessagesPasswordSplunkAccount(mid)
{
	 if(mid==-1) {
	 return("Enter your Password");
	 }
	 if(mid==-2) {
	 return("Length of the Password cannot be less than 4");
	 }
	 else if(mid==1) {
	 return("Password is Valid");
	 }
}
/**
* Classification of display message for String
* Display messages in popover for the Server Class Name while managing Forwarders
*
*/
function getDisplayMessagesServerClassName(mid)
{
	 if(mid==-1) {
	 return("Enter Server Class Name");
	 }
	 if(mid==-2) {
	 return("Length of the Server Class cannot be less than 2");
	 }
	 else if(mid==1) {
	 return("Server Class Name is Valid");
	 }
	 else if(mid==0) {
	 return("Please Input Server Class Name");
	 }
}
/**
* Classification of display message for String
* Display messages in popover for the Deploy App Name while managing Forwarders
*
*/
function getDisplayMessagesDeployAppName(mid)
{
	 if(mid==-1) {
	 return("Enter Deploy App Name");
	 }
	 if(mid==-2) {
	 return("Length of the App Name cannot be less than 2");
	 }
	 else if(mid==1) {
	 return("App Name is Valid");
	 }
	 else if(mid==0) {
	 return("Please Input App Name");
	 }
}
/**
* Classification of display message for String
* Display messages in popover for the Server Class Regex while managing Forwarders
*
*/
function getDisplayMessagesServerClassRegex(mid)
{
	 if(mid==-1) {
	 return("Enter Server Class Regex");
	 }
	 if(mid==-2) {
	 return("Length of the regex cannot be less than 2");
	 }
	 else if(mid==1) {
	 return("Regex is Valid");
	 }
	 else if(mid==0) {
	 return("Please Input Regex for Forwarders");
	 }
}


/**
* Following Function displays Messages based on the ID provided
* Arguments are : whom - type of data, where - place where message will be displayed, which - displays the inner attribute of element, message_id - id
* It calls furthur classified functions
*/
function displayMessages(whom,where,which,message_id)
{
	where="#"+where;
	mid=message_id;
	if(whom=="username") {
		displayMessagesUserName(where,which,mid);
	}
	else if(whom=="groupname") {
		displayMessagesGroupName(where,which,mid);
	}
	else if(whom=="appteamname") {
		displayMessagesAppTeamName(where,which,mid);
	}
	else if(whom=="rpaasusername") {
		displayMessagesRpaasUserName(where,which,mid);
	}
	else if(whom=="memo") {
		displayMessagesMemo(where,which,mid);
	}
	else if(whom=="serviceid") {
		displayMessagesServiceID(where,which,mid);
	}
	else if(whom=="logfilepath") {
		displayMessagesLogFilePath(where,which,mid);
	}
	else if(whom=="interval") {
		displayMessagesInterval(where,which,mid);
	}
	else if(whom=="scriptname") {
		displayMessagesScriptname(where,which,mid);
	}
	else if(whom=="option") {
		displayMessagesOption(where,which,mid);
	}
	else if(whom=="blacklist") {
		displayMessagesBlacklist(where,which,mid);
	}
	else if(whom=="sourcehostname") {
		displayMessagesSourceHostname(where,which,mid);
	}
	else if(whom=="sourcetype") {
		displayMessagesSourcetype(where,which,mid);
	}
	else if(whom=="email") {
		displayMessagesEmail(where,which,mid);
	}
	else if(whom=="filename") {
		displayMessagesFileName(where,which,mid);
	}
	else if(whom=="filetype") {
		displayMessagesFileType(where,which,mid);
	}
	else if(whom=="password") {
	displayMessagesPassword(where,which,mid);
	}
	else if(whom=="passwordconfirm") {
	displayMessagesPasswordConfirm(where,which,mid);
	}
	else if(whom=="passwordsplunkaccount") {
	displayMessagesPasswordSplunkAccount(where,which,mid);
	}
	else if(whom=="serverclassname") {
	displayMessagesServerClassName(where,which,mid);
	}
	else if(whom=="deployappname") {
	displayMessagesDeployAppName(where,which,mid);
	}
	else if(whom=="serverclassregex") {
	displayMessagesServerClassRegex(where,which,mid);
	}
	else {
	}
}
/**
* Following Function is a classification of displayMessages function
* It displays messages for 'UserName's
* mid is the message ID, 1 means perfect while negative ids means some error occured
*/
function displayMessagesUserName(where,which,mid)
{
	message=getDisplayMessages("username",mid);
	$(where).attr(which,message);
}
/**
* Following Function is a classification of displayMessages function
* It displays messages for 'GroupName's
* mid is the message ID, 1 means perfect while negative ids means some error occured
*/
function displayMessagesGroupName(where,which,mid)
{
	 message=getDisplayMessages("groupname",mid);
	 $(where).attr(which,message);
}
/**
* Following Function is a classification of displayMessages function
* It displays messages for 'AppTeamName's
* mid is the message ID, 1 means perfect while negative ids means some error occured
*/
function displayMessagesAppTeamName(where,which,mid)
{
	 message=getDisplayMessages("appteamname",mid);
	 $(where).attr(which,message);
}
/**
* Following Function is a classification of displayMessages function
* It displays messages for 'RPaasUserName's
* mid is the message ID, 1 means perfect while negative ids means some error occured
*/
function displayMessagesRpaasUserName(where,which,mid)
{
	 message=getDisplayMessages("rpaasusername",mid);
	 $(where).attr(which,message);
}

function displayMessagesMemo(where,which,mid)
{
	 message=getDisplayMessages("memo",mid);
	 $(where).attr(which,message);
}

function displayMessagesServiceID(where,which,mid)
{
	 message=getDisplayMessages("serviceid",mid);
	 $(where).attr(which,message);
}

function displayMessagesLogFilePath(where,which,mid)
{
	 message=getDisplayMessages("logfilepath",mid);
	 $(where).attr(which,message);
}

function displayMessagesInterval(where,which,mid)
{
	 message=getDisplayMessages("interval",mid);
	 $(where).attr(which,message);
}

function displayMessagesOption(where,which,mid)
{
	 message=getDisplayMessages("option",mid);
	 $(where).attr(which,message);
}

function displayMessagesScriptname(where,which,mid)
{
	 message=getDisplayMessages("scriptname",mid);
	 $(where).attr(which,message);
}

function displayMessagesBlacklist(where,which,mid)
{
	message=getDisplayMessages("blacklist",mid);
	 $(where).attr(which,message);
}

function displayMessagesSourceHostname(where,which,mid)
{
	 message=getDisplayMessages("sourcehostname",mid);
	 $(where).attr(which,message);
}

function displayMessagesSourcetype(where,which,mid)
{
	 message=getDisplayMessages("sourcetype",mid);
	 $(where).attr(which,message);
}

function displayMessagesEmail(where,which,mid)
{
	 message=getDisplayMessages("email",mid);
	 $(where).attr(which,message);
}

function displayMessagesFileName(where,which,mid)
{
	 message=getDisplayMessages("filename",mid);
	 $(where).attr(which,message);
}

function displayMessagesFileType(where,which,mid)
{
	 message=getDisplayMessages("filetype",mid);
	 $(where).attr(which,message);
}

function displayMessagesPassword(where,which,mid)
{
	 message=getDisplayMessages("password",mid);
	 $(where).attr(which,message);
}

function displayMessagesPasswordConfirm(where,which,mid)
{
	 message=getDisplayMessages("passwordconfirm",mid);
	 $(where).attr(which,message);
}

function displayMessagesPasswordSplunkAccount(where,which,mid)
{
	 message=getDisplayMessages("passwordsplunkaccount",mid);
	 $(where).attr(which,message);
}

function displayMessagesServerClassName(where,which,mid)
{
	 message=getDisplayMessages("serverclassname",mid);
	 $(where).attr(which,message);
}

function displayMessagesDeployAppName(where,which,mid)
{
	 message=getDisplayMessages("deployappname",mid);
	 $(where).attr(which,message);
}

function displayMessagesServerClassRegex(where,which,mid)
{
	 message=getDisplayMessages("serverclassregex",mid);
	 $(where).attr(which,message);
}

/**
*         End of validation and display logic
*         Starting Ajax Queries logic
*
*         Structure is as follows
*
*                 function getData()        =>   called to get the data to be passed along with Ajax Call
*                 Function getAddress()     =>   called to get the url address for ajax Call
*                 Function getType          =>   called to get the type of Ajax Call
*                 Function postData()       =>   called after ajax Call is completed
*                 ajaxCall()                =>   call above function from this function
*/

/**
* Following Function is the ajaxCall()
* It makes the Ajax Calls required
* It uses the function that follow this functions
*/

function ajaxCall(whom)
{ 
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
	else if(whom=="user_forwarders_get") {
		in_this=getThisData("env","hidden-text-env",in_this);
	}
	else if(whom=="user_forwarder_add") {
		in_this=getThisData("forwarder_name","input-forwarder-add-name",in_this);
		in_this+="&";
		in_this=getThisData("env","input-forwarder-add-forwarder-env",in_this);
	}
	else if(whom=="user_forwarder_edit") {
		in_this=getThisData("forwarder_name","input-forwarder-edit-name",in_this);
		in_this+="&";
		in_this=getThisData("forwarder","input-forwarder-edit-forwarder",in_this);
	}
	else if(whom=="user_forwarder_delete") {
		in_this=getThisData("forwarder","input-forwarder-delete-forwarder",in_this);
	}
	else if(whom=="forwarders_count_get") {
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
	else if(whom=="user_server_class_get") {
		in_this=getThisData("env","hidden-text-env",in_this);
	}
	else if(whom=="user_server_class_filter_get") {
		in_this=getThisData("env","hidden-text-env",in_this);
	}
	else if(whom=="user_forwarders_from_deployment_server_get") {
		in_this=getThisData("env","hidden-text-env",in_this);
	}
	else if(whom=="user_forwarders_from_deployment_server_add") {
		in_this=getThisData("env","hidden-text-env",in_this);
		in_this+="&";
		in_this=getThisData("forwarders","input-forwarder-add-from-deployment-server-forwarder-names",in_this);
	}
	else if(whom=="user_server_class_forwarders_get") {
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
	 else if(whom=="user_forwarders_get") {
	 in_this="/splunk_users/get_forwarders";
	 }
	 else if(whom=="user_forwarder_add") {
	 in_this="/splunk_users/add_forwarder";
	 }
	 else if(whom=="user_forwarder_edit") {
	 in_this="/splunk_users/edit_forwarder";
	 }
	 else if(whom=="user_forwarder_delete") {
	 in_this="/splunk_users/delete_forwarder";
	 }
	 else if(whom=="forwarders_count_get") {
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
	else if(whom=="user_server_class_get") {
	in_this="/splunk_users/get_server_classes";
	}
	else if(whom=="user_server_class_filter_get") {
	in_this="/splunk_users/list_forwarders";
	}
	else if(whom=="user_forwarders_from_deployment_server_get") {
	in_this = "/splunk_users/list_forwarders_from_deployment_server";
	}
	else if(whom=="user_forwarders_from_deployment_server_add") {
	in_this="/splunk_users/add_forwarder_from_deployment_server";
	}
	else if(whom=="user_server_class_forwarders_get") {
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
	 else if(whom=="user_forwarders_get") {
	 in_this="get";
	 }
	 else if(whom=="user_forwarder_add") {
	 in_this="post";
	 }
	 else if(whom=="user_forwarder_edit") {
	 in_this="post";
	 }
	 else if(whom=="user_forwarder_delete") {
	 in_this="post";
	 }
	 else if(whom=="forwarders_count_get") {
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
	 else if(whom=="user_server_class_get") {
	 in_this="get";
	 }
	 else if(whom=="user_server_class_filter_get") {
	 in_this="get";
	 }
	 else if(whom=="user_forwarders_from_deployment_server_get") {
	 in_this="get";
	 }
	 else if(whom=="user_forwarders_from_deployment_server_add") {
	 in_this="post";
	 }
	 else if(whom=="user_server_class_forwarders_get") {
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
	else if(whom=="user_forwarders_get") {
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

	else if(whom=="user_forwarder_add") { //not executed?
		$('#notice-manage-forwarders').html(data);
		$('#notice-manage-forwarders').css("display","block");
		alertNoticesTimeoutVar = clearAlertNotices();
		if (alertNoticesTimeoutVar != -1) {
			clearTimeout(alertNoticesTimeoutVar);
			alertNoticesTimeoutVar = clearAlertNotices();
		}
		child=$("#user-forwarders-table tbody").children();
		name=$('#input-forwarder-add-name').val();
		if (child.length==0) {
			 $('thead').append("<tr> <td class=\"user-forwarders-table-name\">"+ name +"</td><td class=\"user-forwarders-table-date\"></td><td>Available on Refresh</td><td>Available on Refresh</td> </tr>");
		}
		else {
			 $(child[0]).before("<tr> <td class=\"user-forwarders-table-name\">"+ name +"</td><td class=\"user-forwarders-table-date\"></td><td>Available on Refresh</td><td>Available on Refresh</td> </tr>");
		}
		$('#modal-forwarder-add').modal('toggle');
	}
	else if(whom=="user_forwarder_edit") {
	$('#notice-manage-forwarders').html(data);
	$('#notice-manage-forwarders').css("display","block");
	alertNoticesTimeoutVar = clearAlertNotices();
		if (alertNoticesTimeoutVar != -1) {
		clearTimeout(alertNoticesTimeoutVar);
		alertNoticesTimeoutVar = clearAlertNotices();
		}
	forwarderNumber=$("#input-forwarder-edit-forwarder-number").val();
	$("#user-forwarders-"+forwarderNumber+"-name").html($('#input-forwarder-edit-name').val());
	$('#modal-forwarder-edit').modal('toggle');
	}
	else if(whom=="user_forwarder_delete") {
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
	 else if(whom=="forwarders_count_get") {
	 if (data==0) {
		window.alert("Please Add Forwarders Before Setting up New Input");
		link="/?env="+$("#hidden-text-env").val();
		window.location.href=link;
	 }
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
	 ajaxCall("user_server_class_get"); //refresh server class tbale

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
	else if(whom=="user_server_class_get") {
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
	 else if(whom=="user_forwarders_from_deployment_server_get") {
	 $("#modal-forwarder-add-from-deployment-server-table").append("<thead > <tr><th><input type=\"checkbox\" onclick=\"changeCheckBoxStatus(this,\'modal-fafds-table-check\')\" id =\"modal-fafds-table-check-all\"/></th><th>Forwarder</th></thead>");
	 jQuery.each(data, function(index, value) {
		$("#modal-forwarder-add-from-deployment-server-table").append("<tr id=\"modal-forwarder-add-from-deployment-server-table-row-"+index+"\"> <td> <input type=\"checkbox\" class=\"modal-fafds-table-check\" value=\""+value+"\"/></td><td id=\"modal-forwarder-add-from-deployment-server-table-"+index+"-forwarder-name\">"+value+"</td></tr>");
	 });
	 targetTableRow = "modal-forwarder-add-from-deployment-server-table-row-"
	 getAllForwardersList();
	 }
	else if(whom=="user_forwarders_from_deployment_server_add") {
		removeThisElementChildren($("#user-forwarders-table")); //remove old table
		ajaxCall("user_forwarders_get"); //refresh frowarders table

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
	 else if(whom=="user_server_class_forwarders_get") {
	 regexBreakPoint = data.indexOf("regex")
	 regex = data.splice(regexBreakPoint)
	 regex = regex.splice(1)
	 $("#input-server-class-show-regex").val(regex[0]);
	 $("#modal-user-server-class-show-table").append("<thead > <tr><th style=\"width: 10%\">Forwarder</th></thead>");
	 jQuery.each(data, function(index, value) {
		$("#modal-user-server-class-show-table").append("<tr> <td>"+value+"</td></tr>");
	 });
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
	ajaxCall("user_server_class_get");

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

/**
*      Testing Tutorial Function for New Users
**/
function testTutorial()
{
	 setTimeout(function(){
	$('#tutorial-tabs').append("<div id=\"div-tutorial\" class=\"alert alert-info\" role=\"alert\">You can switch Environments from this Tab</div>");
	 }, 1000);
	 setTimeout(function(){
	 $('#div-tutorial').remove();
	 }, 8000);
	 setTimeout(function(){
	$('#tutorial-settings').append("<div id=\"div-tutorial\" class=\"alert alert-info\" role=\"alert\">You can Manage your Profile From Here</div>");
	 }, 8500);
	 setTimeout(function(){
	 $('#div-tutorial').remove();
	 }, 15500);
	 setTimeout(function(){
	$('#div-sidebar-extra').append("<div id=\"div-tutorial\" class=\"alert alert-info\" role=\"alert\">You can get Specific Environment Account Details from this Section</div>");
	 }, 16000);
	 setTimeout(function(){
	 $('#div-tutorial').remove();
	 }, 23000);
	 setTimeout(function(){
	$('#tab-prod').append("<div id=\"div-tutorial\" class=\"alert alert-info\" role=\"alert\">You can Manage Your Account from this section</div>");
	 }, 23500);
	 setTimeout(function(){
	 $('#div-tutorial').remove();
	 }, 30000);
	 setTimeout(function(){
	$('#i-need-help').append("<div id=\"div-tutorial\" class=\"alert alert-info\" role=\"alert\">You can Access Help Documents From this Link</div>");
	 }, 30500);
	 setTimeout(function(){
	 $('#div-tutorial').remove();
	 }, 37000);
	 setTimeout(function(){
	$('#footer-portal').prepend("<div id=\"div-tutorial\" class=\"alert alert-info\" role=\"alert\">You can send Feedback From here</div>");
	 }, 37500);
	 setTimeout(function(){
	 $('#div-tutorial').remove();
	 }, 44000);
	 setTimeout(function(){
	 $('#notice-home').html("Have a nice time using the Portal, Please contact US if you need any help");
	 }, 44000);
	 setTimeout(function(){
	 $('#notice-home').remove();
	 }, 46000);
}
