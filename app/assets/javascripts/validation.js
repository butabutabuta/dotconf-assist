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