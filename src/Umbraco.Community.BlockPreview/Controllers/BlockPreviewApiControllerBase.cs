using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Web.Common.Authorization;

namespace Umbraco.Community.BlockPreview.Controllers
{
    [ApiExplorerSettings(GroupName = "BlockPreview")]
    [Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
    [VersionedApiBackOfficeRoute("block-preview")]
    public class BlockPreviewApiControllerBase : ManagementApiControllerBase { }
}
