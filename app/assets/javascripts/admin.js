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

function adminUsersInputsGenerate()
{
	var url="/admin/generateconf?id="+$('#adminusersinputsgenerate').attr('value');
	window.open(url, '_blank');
}