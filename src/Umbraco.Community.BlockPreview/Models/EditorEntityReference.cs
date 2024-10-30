using System.Text.Json.Serialization;

namespace Umbraco.Community.BlockPreview.Models
{
    public class EditorEntityReference
    {
        [JsonPropertyName("type")]
        public required string Type { get; set; }

        [JsonPropertyName("unique")]
        public required Guid Unique { get; set; }
    }
}
