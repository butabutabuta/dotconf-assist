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