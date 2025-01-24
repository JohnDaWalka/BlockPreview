using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace Umbraco.Community.BlockPreview.Interfaces
{
    public interface IBlockPreviewService
    {
        Task<string> RenderGridBlock(string blockData, IPublishedContent content, ControllerContext controllerContext, string blockEditorAlias = "", Guid documentTypeUnique = default, string contentUdi = "", string? settingsUdi = default);

        Task<string> RenderListBlock(string blockData, IPublishedContent content, ControllerContext controllerContext, string blockEditorAlias = "", Guid documentTypeUnique = default);

        Task<string> RenderRichTextBlock(string blockData, IPublishedContent content, ControllerContext controllerContext, string blockEditorAlias = "", Guid documentTypeUnique = default);
    }
}
