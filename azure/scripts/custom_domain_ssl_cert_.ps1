param(
    [Parameter(Mandatory=$True)]
    [string]$cdnProfileName,

    [Parameter(Mandatory=$True)]
    [string]$cdnEndpointName,

    [Parameter(Mandatory=$True)]
    [string]$cdnCustomDomainName,

    [Parameter(Mandatory=$True)]
    [string]$keyVaultName,

    [Parameter(Mandatory=$True)]
    [string]$certificateName,

    [Parameter(Mandatory=$True)]
    [string]$resourceGroupNameForProfile
)

# Check and install Module Az.Accounts
if (-not (Get-Module Az.Accounts)) {
    Import-Module Az.Accounts
}

#Resource Details
$keyVault = Get-AzKeyVault -VaultName $keyVaultName;
$certificate = Get-AzKeyVaultSecret -VaultName $keyVault.VaultName -Name $certificateName;
$secretName = $certificate.Name;
$secretVersion = $certificate.Version;
$keyVaultResourceGroupName = $keyVault.ResourceGroupName;
$cdnCustomDomainNameAltered = $cdnCustomDomainName.replace('.','-')

$cdnProfile = Get-AzCdnProfile -ProfileName $cdnProfileName -ResourceGroupName $resourceGroupNameForProfile;
$resourceGroup = Get-AzResourceGroup -Name $cdnProfile.ResourceGroupName;
$resourceGroupName = $resourceGroup.ResourceGroupName;
$cdnEndpoint = Get-AzCdnEndpoint -ResourceGroupName $resourceGroup.ResourceGroupName `
    -ProfileName $cdnProfile.Name `
    -EndpointName $cdnEndpointName;
$cdnCustomDomain = Get-AzCdnCustomDomain -ResourceGroupName $resourceGroup.ResourceGroupName `
    -ProfileName $cdnProfile.Name `
    -EndpointName $cdnEndpointName `
    -CustomDomainName $cdnCustomDomainNameAltered;

# Authentication
$context = Get-AzContext;
$subscriptionId = $context.Subscription.Id;
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile;
if (-not $azProfile.Accounts.Count) {
    Write-Error "Naah. Ensure you have logged in before calling this."
    Exit 1
}
$profileClient = New-Object Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azProfile);
$token = $profileClient.AcquireAccessToken($context.Subscription.TenantId) ;
$accessToken = $token.AccessToken;
if (-not $accessToken) {
    Write-Error "Naah. Auth failed!";
    Exit 1
}

#URL for HTTPS Enable
$apiVersion = '2019-04-15'; #2019-12-31
$url = "https://management.azure.com" +
    "/subscriptions/$subscriptionId" +
    "/resourceGroups/$resourceGroupName" +
    "/providers/Microsoft.Cdn" +
    "/profiles/$cdnProfileName" +
    "/endpoints/$cdnEndpointName" +
    "/customDomains/$cdnCustomDomainNameAltered" +
    "/enableCustomHttps?api-version=$apiVersion"

#URL for checking whether HTTPS is enabled or disabled
$StatusUri = "https://management.azure.com" + 
    "/subscriptions/$subscriptionId" + 
    "/resourcegroups/$resourceGroupName" + 
    "/providers/Microsoft.Cdn" + 
    "/profiles/$cdnProfileName" +
    "/endpoints/$cdnEndpointName" + 
    "/customdomains/$($cdnCustomDomainNameAltered)?api-version=$apiVersion"

#Post request parameters
$postParams = @{
    "certificateSource" = "AzureKeyVault"
    "certificateSourceParameters" = @{
        "@odata.type" = "#Microsoft.Azure.Cdn.Models.KeyVaultCertificateSourceParameters"
        "deleteRule" = "NoAction"
        "updateRule" = "NoAction"
        "subscriptionId" = $subscriptionId
        "resourceGroupName" = $keyVaultResourceGroupName
        "vaultName" = $keyVaultName
        "SecretName" = $secretName
     #  "SecretVersion" = $secretVersion
    }
	"minimumTlsVersion" = "TLS12"
    "protocolType" = "ServerNameIndication"
};

$params = @{
    ContentType = 'application/json'
    Headers = @{
        'accept' = 'application/json'
        'Authorization' = "Bearer " + $accessToken
    }
    Method = 'Post'
    URI = $url
};
$bodyJson = ($postParams | ConvertTo-Json);
Write-Debug "Body:\n$bodyJson"

$headers = @{}
  
$headers.Add('Authorization',"Bearer $accessToken")

$status = (Invoke-RestMethod -Method GET -UseBasicParsing -Uri $StatusUri -Headers $Headers).properties.customHttpsProvisioningState

#conditional statements 
if ($status -eq "Enabled"){      
      
Write-Verbose -Verbose "Current status is $($status), so exiting"
  
}
else
{   

Write-Verbose -Verbose "Current status is $($status)"
         
Write-Verbose -Verbose "Applying custom cert to $($cdnProfileName):$($cdnEndpointName)"
      
Invoke-RestMethod @params -Body $bodyJson;
  
}