using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Globalization;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Extensions;

namespace Umbraco.Community.BlockPreview.Extensions;

public static class StringExtensions
{
    public static string ToPascalCase(this string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return value;
        }

        return $"{char.ToUpper(value[0], CultureInfo.CurrentCulture)}{value[1..]}";
    }

    public static bool TryConvertToGridItem(this object? rawPropValue, out BlockValue<BlockGridLayoutItem>? value)
    {
        if (!rawPropValue?.ToString()?.DetectIsJson() == true || rawPropValue is not JObject jObject)
        {
            value = default;
            return false;
        }

        var keys = jObject.Properties().Select(x => x.Name);

        if (keys.Contains("Layout", StringComparer.InvariantCultureIgnoreCase) ||
            keys.Contains("ContentData", StringComparer.InvariantCultureIgnoreCase) ||
            keys.Contains("SettingsData", StringComparer.InvariantCultureIgnoreCase))
        {
            value = JsonConvert.DeserializeObject<BlockValue<BlockGridLayoutItem>>(rawPropValue?.ToString()!);
            return true;
        }

        value = default;
        return false;
    }
}