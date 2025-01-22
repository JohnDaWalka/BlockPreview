using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Cache.PropertyEditors;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Community.BlockPreview.Enums;
using Umbraco.Community.BlockPreview.Extensions;
using Umbraco.Community.BlockPreview.Interfaces;
using Umbraco.Community.BlockPreview.Models;
using Umbraco.Extensions;

namespace Umbraco.Community.BlockPreview.Services
{
    public class BlockPreviewService : IBlockPreviewService
    {
        private readonly ITempDataProvider _tempDataProvider;
        private readonly IViewComponentHelperWrapper _viewComponentHelperWrapper;
        private readonly IRazorViewEngine _razorViewEngine;
        private readonly BlockPreviewOptions _options;
        private readonly ITypeFinder _typeFinder;
        private readonly BlockEditorConverter _blockEditorConverter;
        private readonly IViewComponentSelector _viewComponentSelector;
        private readonly IPublishedValueFallback _publishedValueFallback;
        private readonly IJsonSerializer _jsonSerializer;
        private readonly IDataTypeService _dataTypeService;
        private readonly IContentTypeService _contentTypeService;
        private readonly IAppPolicyCache _runtimeCache;
        private readonly IWebHostEnvironment _webHostEnvironment;

        private const string BLOCK_TYPE_CACHE_KEY = "BlockPreview_BlockType_{0}";
        private const string CONTENT_TYPE_CACHE_KEY = "BlockPreview_ContentType_{0}";
        private const string DATA_TYPE_CACHE_KEY = "BlockPreview_DataType_{0}";
        private const string VIEW_RESULT_CACHE_KEY = "BlockPreview_ViewResult_{0}_{1}";
        private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(1);

        public BlockPreviewService(
            ITempDataProvider tempDataProvider,
            IViewComponentHelperWrapper viewComponentHelperWrapper,
            IRazorViewEngine razorViewEngine,
            ITypeFinder typeFinder,
            BlockEditorConverter blockEditorConverter,
            IViewComponentSelector viewComponentSelector,
            IPublishedValueFallback publishedValueFallback,
            IOptions<BlockPreviewOptions> options,
            IJsonSerializer jsonSerializer,
            IContentTypeService contentTypeService,
            IDataTypeService dataTypeService,
            IBlockEditorElementTypeCache elementTypeCache,
            ILogger<BlockPreviewService> logger,
            AppCaches appCaches,
            IWebHostEnvironment webHostEnvironment)
        {
            _tempDataProvider = tempDataProvider;
            _viewComponentHelperWrapper = viewComponentHelperWrapper;
            _razorViewEngine = razorViewEngine;
            _typeFinder = typeFinder;
            _blockEditorConverter = blockEditorConverter;
            _viewComponentSelector = viewComponentSelector;
            _publishedValueFallback = publishedValueFallback;
            _options = options.Value;
            _jsonSerializer = jsonSerializer;
            _dataTypeService = dataTypeService;
            _contentTypeService = contentTypeService;
            _webHostEnvironment = webHostEnvironment;
            _runtimeCache = appCaches.RuntimeCache;
        }

        #region Public
        public async Task<string> RenderGridBlock(
            string blockData,
            IPublishedContent content,
            ControllerContext controllerContext,
            string blockEditorAlias = "",
            Guid documentTypeUnique = default,
            string contentKey = "",
            string? settingsKey = default)
        {
            BlockGridEditorDataConverter converter = new BlockGridEditorDataConverter(_jsonSerializer);
            if (!converter.TryDeserialize(blockData, out BlockEditorData<BlockGridValue, BlockGridLayoutItem>? blockValue))
                return string.Empty;

            if (!Guid.TryParse(contentKey, out Guid contentGuidParsed))
                return string.Empty;

            Guid.TryParse(settingsKey!, out Guid settingsGuidParsed);

            BlockItemData? contentData = blockValue.BlockValue?.ContentData.FirstOrDefault(x => x.Key == contentGuidParsed);
            if (contentData == null)
                return string.Empty;

            IPublishedElement? contentElement = ConvertToElement(contentData, true, content);

            BlockItemData? settingsData = settingsGuidParsed != Guid.Empty
                ? blockValue.BlockValue?.SettingsData.FirstOrDefault(x => x.Key == settingsGuidParsed)
                : null;

            IPublishedElement? settingsElement = settingsData != null ? ConvertToElement(settingsData, true, content) : default;

            Type? contentBlockType = FindBlockType(contentElement?.ContentType.Alias);
            Type? settingsBlockType = settingsElement != null ? FindBlockType(settingsElement.ContentType.Alias) : default;

            if (contentBlockType == null || (settingsElement != null && settingsBlockType == null))
            {
                return $"<div class=\"preview-alert preview-alert-warning\">ModelsBuilder is enabled but the generated model(s) could not be found. Please try regenerating models and restarting the application.</div>";
            }

            BlockGridItem? blockInstance = CreateBlockInstance(
                BlockType.BlockGrid,
                contentBlockType, contentElement,
                settingsBlockType, settingsElement, contentData.Key,
                settingsData?.Key
            ) as BlockGridItem;

            if (blockInstance == null)
                return string.Empty;

            var layoutItems = blockValue.BlockValue?.GetLayouts();
            BlockGridLayoutItem? matchingLayout = GetMatchingGridLayout(layoutItems!, blockInstance);

            IContentType? documentType = GetContentType(documentTypeUnique);
            if (documentType == null)
                return string.Empty;

            IPropertyType? property = documentType.PropertyTypes.FirstOrDefault(x => x.Alias.Equals(blockEditorAlias));
            if (property == null)
            {
                property = documentType.CompositionPropertyTypes.FirstOrDefault(x => x.Alias.Equals(blockEditorAlias));

                if (property == null)
                    return string.Empty;
            }

            IDataType? dataType = await GetDataType(property.DataTypeKey);
            if (dataType == null)
                return string.Empty;

            BlockGridConfiguration? config = dataType.ConfigurationAs<BlockGridConfiguration>();
            if (config == null)
                return string.Empty;

            BlockGridConfiguration.BlockGridBlockConfiguration? matchingBlockConfig = config.Blocks.FirstOrDefault(x => x.ContentElementTypeKey == contentData.ContentTypeKey);
            if (matchingBlockConfig == null)
                return string.Empty;

            ConfigureBlockInstanceAreas(blockInstance, config, matchingBlockConfig, matchingLayout!, blockValue, content, documentTypeUnique, blockEditorAlias);

            ViewDataDictionary viewData = CreateViewData(blockInstance, BlockType.BlockGrid, matchingBlockConfig);
            return await GetMarkup(controllerContext, contentElement?.ContentType.Alias, viewData, BlockType.BlockGrid);
        }

        public async Task<string> RenderListBlock(
            string blockData,
            IPublishedContent content,
            ControllerContext controllerContext,
            string blockEditorAlias = "",
            Guid documentTypeUnique = default)
        {
            var converter = new BlockListEditorDataConverter(_jsonSerializer);
            if (!converter.TryDeserialize(blockData, out BlockEditorData<BlockListValue, BlockListLayoutItem>? blockValue))
                return string.Empty;

            BlockItemData? contentData = blockValue.BlockValue?.ContentData.FirstOrDefault();
            if (contentData == null)
                return string.Empty;

            IPublishedElement? contentElement = ConvertToElement(contentData, true, content);

            BlockItemData? settingsData = blockValue.BlockValue?.SettingsData.FirstOrDefault();
            IPublishedElement? settingsElement = settingsData != null ? ConvertToElement(settingsData, true, content) : default;

            Type? contentBlockType = FindBlockType(contentElement?.ContentType.Alias);
            Type? settingsBlockType = settingsElement != null ? FindBlockType(settingsElement.ContentType.Alias) : default;

            if (contentBlockType == null || (settingsElement != null && settingsBlockType == null))
            {
                return $"<div class=\"preview-alert preview-alert-warning\">ModelsBuilder is enabled but the generated model(s) could not be found. Please try regenerating models and restarting the application.</div>";
            }

            BlockListItem? blockInstance = CreateBlockInstance(
                BlockType.BlockList,
                contentBlockType, contentElement,
                settingsBlockType, settingsElement,
                contentData.Key, settingsData?.Key
            ) as BlockListItem;

            if (blockInstance == null)
                return string.Empty;

            ViewDataDictionary viewData = CreateViewData(blockInstance, BlockType.BlockList);
            return await GetMarkup(controllerContext, contentElement?.ContentType.Alias, viewData, BlockType.BlockList);
        }

        public async Task<string> RenderRichTextBlock(
            string blockData,
            IPublishedContent content,
            ControllerContext controllerContext,
            string blockEditorAlias = "",
            Guid documentTypeUnique = default)
        {
            var converter = new RichTextEditorBlockDataConverter(_jsonSerializer);
            if (!converter.TryDeserialize(blockData, out BlockEditorData<RichTextBlockValue, RichTextBlockLayoutItem>? blockValue))
                return string.Empty;

            BlockItemData? contentData = blockValue.BlockValue?.ContentData.FirstOrDefault();
            if (contentData == null)
                return string.Empty;

            IPublishedElement? contentElement = ConvertToElement(contentData, true, content);

            BlockItemData? settingsData = blockValue.BlockValue?.SettingsData.FirstOrDefault();
            IPublishedElement? settingsElement = settingsData != null ? ConvertToElement(settingsData, true, content) : default;

            Type? contentBlockType = FindBlockType(contentElement?.ContentType.Alias);
            Type? settingsBlockType = settingsElement != null ? FindBlockType(settingsElement.ContentType.Alias) : default;

            if (contentBlockType == null || (settingsElement != null && settingsBlockType == null))
            {
                return $"<div class=\"preview-alert preview-alert-warning\">ModelsBuilder is enabled but the generated model(s) could not be found. Please try regenerating models and restarting the application.</div>";
            }

            RichTextBlockItem? blockInstance = CreateBlockInstance(
                BlockType.RichText,
                contentBlockType, contentElement,
                settingsBlockType, settingsElement, contentData.Key,
                settingsData?.Key
            ) as RichTextBlockItem;

            if (blockInstance == null)
                return string.Empty;

            ViewDataDictionary viewData = CreateViewData(blockInstance, BlockType.RichText);
            return await GetMarkup(controllerContext, contentElement?.ContentType.Alias, viewData, BlockType.RichText);
        }
        #endregion

        #region Private
        private Type? FindBlockType(string? contentTypeAlias)
        {
            if (string.IsNullOrEmpty(contentTypeAlias))
                return null;

            var cacheKey = string.Format(BLOCK_TYPE_CACHE_KEY, contentTypeAlias);
            return _runtimeCache.GetCacheItem(cacheKey, () =>
            {
                return _typeFinder
                    .FindClassesWithAttribute<PublishedModelAttribute>()
                    .FirstOrDefault(x => x.GetCustomAttribute<PublishedModelAttribute>(false)?.ContentTypeAlias == contentTypeAlias);
            }, CacheDuration);
        }

        private IContentType? GetContentType(Guid documentTypeUnique)
        {
            var cacheKey = string.Format(CONTENT_TYPE_CACHE_KEY, documentTypeUnique);
            return _runtimeCache.GetCacheItem(cacheKey, () =>
            {
                return _contentTypeService.Get(documentTypeUnique);
            }, CacheDuration);
        }

        private async Task<IDataType?> GetDataType(Guid dataTypeKey)
        {
            var cacheKey = string.Format(DATA_TYPE_CACHE_KEY, dataTypeKey);
            return await _runtimeCache.GetCacheItem(cacheKey, async () =>
            {
                return await _dataTypeService.GetAsync(dataTypeKey);
            }, CacheDuration);
        }

        private IPublishedElement? ConvertToElement(BlockItemData data, bool throwOnError, IPublishedElement owner)
        {
            // There's nested data
            Parallel.ForEach(data.Values, prop =>
            {
                string? propertyAsString = prop.Value as string ?? JsonSerializer.Serialize(prop.Value);

                if (propertyAsString?.Contains(nameof(BlockListLayoutItem)) == true)
                {
                    var blockListConverter = new BlockListEditorDataConverter(_jsonSerializer);
                    if (blockListConverter.TryDeserialize(propertyAsString, out BlockEditorData<BlockListValue, BlockListLayoutItem>? blockListValue))
                    {
                        var fullBlockValue = blockListValue.BlockValue;
                        //foreach (var contentData in fullBlockValue.ContentData)
                        //{
                        //    var nestedElement = ConvertToElement(contentData, throwOnError, owner);
                        //}

                        prop.Value = JsonSerializer.Serialize(fullBlockValue, new JsonSerializerOptions
                        {
                            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                        });
                    }
                }

                else if (propertyAsString?.Contains(nameof(BlockGridLayoutItem)) == true)
                {
                    var blockGridConverter = new BlockGridEditorDataConverter(_jsonSerializer);
                    if (blockGridConverter.TryDeserialize(propertyAsString, out BlockEditorData<BlockGridValue, BlockGridLayoutItem>? blockGridValue))
                    {
                        var fullBlockValue = blockGridValue.BlockValue;
                        //foreach (var contentData in fullBlockValue.ContentData)
                        //{
                        //    var nestedElement = ConvertToElement(contentData, throwOnError, owner);
                        //}

                        prop.Value = JsonSerializer.Serialize(fullBlockValue, new JsonSerializerOptions
                        {
                            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                        });
                    }
                }

                else
                {
                    if (prop.Value is JsonObject jsonObject)
                    {
                        if (jsonObject.ContainsKey("unique") && jsonObject.ContainsKey("type"))
                        {
                            try
                            {
                                using (var document = JsonDocument.Parse(propertyAsString))
                                {
                                    // Ensure that the JSON is an array
                                    if (document.RootElement.ValueKind == JsonValueKind.Array)
                                    {
                                        bool isValidArray = true;
                                        // Check each object in the array
                                        foreach (var el in document.RootElement.EnumerateArray())
                                        {
                                            // Validate that each element is an object with only "unique" and "type" properties
                                            if (el.ValueKind != JsonValueKind.Object ||
                                                el.EnumerateObject().Count() != 2 ||
                                                !el.TryGetProperty("unique", out _) ||
                                                !el.TryGetProperty("type", out _))
                                            {
                                                isValidArray = false;
                                                break;
                                            }
                                        }
                                        // If all elements in the array match the criteria, proceed with deserialization
                                        if (isValidArray)
                                        {
                                            var entityReference = JsonSerializer.Deserialize<List<EditorEntityReference>>(propertyAsString);
                                            if (entityReference != null)
                                            {
                                                prop.Value = string.Join(",", entityReference.Select(x => new StringUdi(x.Type, x.Unique.ToString())));
                                            }
                                        }
                                    }
                                }
                            }
                            catch (JsonException)
                            {
                                if (throwOnError)
                                    throw new InvalidOperationException($"Invalid JSON format for property '{prop.Alias}'.");
                            }
                        }
                    }

                    else prop.Value = propertyAsString;
                }
            });

            var element = _blockEditorConverter.ConvertToElement(owner, data, PropertyCacheLevel.None, throwOnError);
            if (element == null && throwOnError)
                throw new InvalidOperationException($"Unable to find Element {data?.ContentTypeAlias}");

            return element;
        }

        private BlockGridLayoutItem? GetMatchingGridLayout(IEnumerable<BlockGridLayoutItem> layoutItems, BlockGridItem? blockInstance)
        {
            if (layoutItems == null || blockInstance == null)
                return null;

            foreach (var layoutItem in layoutItems)
            {
                if (layoutItem.ContentKey == blockInstance.ContentKey)
                {
                    blockInstance.RowSpan = layoutItem.RowSpan!.Value;
                    blockInstance.ColumnSpan = layoutItem.ColumnSpan!.Value;
                    return layoutItem;
                }
                else
                {
                    foreach (var area in layoutItem.Areas)
                    {
                        foreach (var item in area.Items)
                        {
                            if (item.ContentKey != blockInstance.ContentKey) continue;
                            blockInstance.RowSpan = item.RowSpan!.Value;
                            blockInstance.ColumnSpan = item.ColumnSpan!.Value;
                            return layoutItem;
                        }
                    }
                }
            }

            return null;
        }

        private ViewDataDictionary CreateViewData(object? typedBlockInstance, BlockType? blockType = default, BlockGridConfiguration.BlockGridBlockConfiguration? matchingBlockConfig = null)
        {
            var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
            {
                Model = typedBlockInstance
            };

            if (blockType == BlockType.BlockGrid && matchingBlockConfig != null && matchingBlockConfig.Areas.Any())
            {
                viewData["matchingBlockConfig"] = matchingBlockConfig;
            }

            viewData["blockPreview"] = true;

            if (blockType == BlockType.BlockGrid)
                viewData["blockGridPreview"] = true;

            return viewData;
        }

        private object? CreateBlockInstance(BlockType blockType, Type? contentBlockType, IPublishedElement? contentElement, Type? settingsBlockType, IPublishedElement? settingsElement, Guid? contentKey, Guid? settingsGuid)
        {
            if (contentBlockType != null)
            {
                var contentInstance = Activator.CreateInstance(contentBlockType, contentElement, _publishedValueFallback);
                var settingsInstance = settingsBlockType != null ? Activator.CreateInstance(settingsBlockType, settingsElement, _publishedValueFallback) : null;

                Type blockItemType;
                if (blockType == BlockType.BlockGrid)
                {
                    blockItemType = settingsBlockType != null ?
                        typeof(BlockGridItem<,>).MakeGenericType(contentBlockType, settingsBlockType) :
                        typeof(BlockGridItem<>).MakeGenericType(contentBlockType);
                }
                else if (blockType == BlockType.RichText)
                {
                    blockItemType = settingsBlockType != null ?
                        typeof(RichTextBlockItem<,>).MakeGenericType(contentBlockType, settingsBlockType) :
                        typeof(RichTextBlockItem<>).MakeGenericType(contentBlockType);

                }
                else
                {
                    blockItemType = settingsBlockType != null ?
                        typeof(BlockListItem<,>).MakeGenericType(contentBlockType, settingsBlockType) :
                        typeof(BlockListItem<>).MakeGenericType(contentBlockType);
                }

                return Activator.CreateInstance(blockItemType, contentKey, contentInstance, settingsGuid, settingsInstance);
            }

            return null;
        }

        private async Task<string> GetMarkup(ControllerContext controllerContext, string? contentAlias, ViewDataDictionary viewData, BlockType blockType)
        {
            var viewComponent = _viewComponentSelector.SelectComponent(contentAlias);

            return viewComponent != null
                ? await GetMarkupFromViewComponent(controllerContext, viewData, viewComponent)
                : await GetMarkupFromPartial(controllerContext, viewData, contentAlias, blockType);
        }

        private async Task<string> GetMarkupFromPartial(
            ControllerContext controllerContext,
            ViewDataDictionary viewData,
            string? contentAlias,
            BlockType blockType)
        {
            var viewResult = GetViewResult(contentAlias, blockType);

            if (viewResult == null)
            {
                viewResult =
                    _razorViewEngine.FindView(controllerContext, contentAlias!, false) ??
                    _razorViewEngine.FindView(controllerContext, contentAlias?.ToPascalCase()!, false);

                if (!viewResult.Success)
                    return string.Empty;
            }

            if (viewResult.View == null)
                return string.Empty;

            var actionContext = new ActionContext(controllerContext.HttpContext, new RouteData(), new ActionDescriptor());

            await using var sw = new StringWriter();

            if (viewData != null)
            {
                var viewContext = new ViewContext(actionContext, viewResult.View, viewData,
                    new TempDataDictionary(actionContext.HttpContext, _tempDataProvider), sw, new HtmlHelperOptions());

                await viewResult.View.RenderAsync(viewContext);
            }

            return sw.ToString();
        }

        private async Task<string> GetMarkupFromViewComponent(
            ControllerContext controllerContext,
            ViewDataDictionary viewData,
            ViewComponentDescriptor viewComponent)
        {
            await using var sw = new StringWriter();
            var viewContext = new ViewContext(
                controllerContext,
                new FakeView(),
                viewData,
                new TempDataDictionary(controllerContext.HttpContext, _tempDataProvider),
                sw,
                new HtmlHelperOptions());

            _viewComponentHelperWrapper.Contextualize(viewContext);

            var result = await _viewComponentHelperWrapper.InvokeAsync(viewComponent.TypeInfo.AsType(), viewData.Model);
            result.WriteTo(sw, HtmlEncoder.Default);
            return sw.ToString();
        }

        private void ConfigureBlockInstanceAreas(
            BlockGridItem blockInstance,
            BlockGridConfiguration config,
            BlockGridConfiguration.BlockGridBlockConfiguration matchingBlock,
            BlockGridLayoutItem layoutItem,
            BlockEditorData<BlockGridValue, BlockGridLayoutItem> blockValue,
            IPublishedContent content,
            Guid documentTypeUnique,
            string blockEditorAlias)
        {
            blockInstance.AreaGridColumns = matchingBlock.AreaGridColumns ?? 12;
            blockInstance.GridColumns = config.GridColumns ?? 12;

            var blockConfigAreaMap = matchingBlock.Areas.ToDictionary(area => area.Key);
            if (layoutItem == null || blockConfigAreaMap == null || !blockConfigAreaMap.Any())
                return;

            blockInstance.Areas = layoutItem.Areas.Select(area =>
            {
                if (!blockConfigAreaMap.TryGetValue(area.Key, out var areaConfig))
                    return null;

                //var items = area.Items.Select(item =>
                //{
                //    //BlockItemData? areaContentData = blockValue.BlockValue?.ContentData.FirstOrDefault(x => x.Key == item.ContentKey);
                //    //IPublishedElement? areaContentElement = ConvertToElement(areaContentData!, true, content);

                //    //BlockItemData? areaSettingsData = blockValue.BlockValue?.SettingsData.FirstOrDefault(x => x.Key == item.ContentKey);
                //    //IPublishedElement? areaSettingsElement = areaSettingsData != null ? ConvertToElement(areaSettingsData, true, content) : default;
                    
                //    //return new BlockGridItem(item.ContentKey, areaContentElement!, item.SettingsKey, areaSettingsElement!);
                //}).WhereNotNull().ToList();

                return new BlockGridArea(new List<BlockGridItem>(area.Items.Count()), areaConfig.Alias!, areaConfig.RowSpan!.Value, areaConfig.ColumnSpan!.Value);
            }).WhereNotNull().ToArray();
        }

        private ViewEngineResult? GetViewResult(string? contentAlias, BlockType blockType)
        {
            if (string.IsNullOrEmpty(contentAlias))
                return null;

            var viewPaths = _options.GetViewLocations(blockType);

            if (viewPaths == null || !viewPaths.Any())
                return null;

            ViewEngineResult? viewResult = null;
            string appRoot = _webHostEnvironment.ContentRootPath;

            foreach (var viewPath in viewPaths)
            {
                string baseViewPath = viewPath.TrimStart($"~{Path.DirectorySeparatorChar}").TrimStart("/");

                var pathNonPascal = string.Format(baseViewPath, contentAlias ?? "");
                var viewPathNonPascal = Path.Combine(appRoot, pathNonPascal);

                if (System.IO.File.Exists(viewPathNonPascal))
                {
                    viewResult = _razorViewEngine.GetView("", pathNonPascal, false);

                    if (viewResult.Success)
                        return viewResult;
                }

                else
                {
                    var pathPascal = string.Format(baseViewPath, contentAlias?.ToPascalCase() ?? "");
                    var viewPathPascal = Path.Combine(appRoot, pathPascal);

                    if (System.IO.File.Exists(viewPathPascal))
                    {
                        viewResult = _razorViewEngine.GetView("", pathPascal, false);

                        if (viewResult.Success)
                            return viewResult;
                    }
                }
                return null;
            }

            return null;
        }

        private sealed class FakeView : IView
        {
            public string Path => string.Empty;

            public Task RenderAsync(ViewContext context)
            {
                return Task.CompletedTask;
            }
        }
#endregion
    }
}