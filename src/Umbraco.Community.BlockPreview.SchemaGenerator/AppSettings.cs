namespace Umbraco.Community.BlockPreview.SchemaGenerator
{
    internal class AppSettings
    {
        public BlockPreviewDefinition BlockPreview { get; set; }

        internal class BlockPreviewDefinition
        {
            public BlockWithStylesheetSettings BlockGrid { get; set; }
            public BlockWithStylesheetSettings BlockList { get; set; }
            public BlockTypeSettings RichText { get; set; }
        }
    }
}
