const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {

    // Pass through
    // --------------------------------------------------------   
    eleventyConfig.addPassthroughCopy('./src/assets')
    eleventyConfig.addPassthroughCopy('./src/css')
    eleventyConfig.addPassthroughCopy('./src/js')
    eleventyConfig.addPassthroughCopy('./src/fonts')
    eleventyConfig.addPassthroughCopy('./src/admin')
    eleventyConfig.addPassthroughCopy('./src/.htaccess')

    // Shortcodes
    // --------------------------------------------------------
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    // Plugins
    // --------------------------------------------------------
    eleventyConfig.addPlugin(pluginRss);

    // Filters
    // --------------------------------------------------------
    // Format Javascript dateObj
    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).plus({ days: 1 }).toLocaleString(DateTime.DATE_MED);
    });

    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    eleventyConfig.addFilter('htmlDateString', (dateObj) => {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('dd LLL yyyy');
    });
    
    // Collections
    // --------------------------------------------------------

    // Returns a collection of blog posts in reverse date order
    eleventyConfig.addCollection('blog', collection => {
        return [...collection.getFilteredByGlob('./src/blog/*.md')].reverse();
    });

    // Tags
    // --------------------------------------------------------
    
    // Create a list of tags, excluding certain tags
    function filterTagList(tags) {
        return (tags || []).filter(tag => [
            "all", 
            "nav", 
            "post", 
            "posts", 
            "pages", 
            "featured"
        ].indexOf(tag) === -1);
    }

    // Add the Eleventy Filter for tags
    eleventyConfig.addFilter("filterTagList", filterTagList)

    // Create an array of all tags
    eleventyConfig.addCollection('tagList', collection => {
        let tagSet = new Set();
        collection.getAll().forEach(item => {
        (item.data.tags || []).forEach(tag => tagSet.add(tag));
        });

        return filterTagList([...tagSet]);
    });


    // Open browser automatically when browser sync is triggered
    eleventyConfig.setBrowserSyncConfig({
        open: true,
      });

    // Nunjucks Filters
    // --------------------------------------------------------

    // Use the limitTo filter to restrict the number of results returned from a collection
     eleventyConfig.addNunjucksFilter('limitTo', require('./src/js/filters/nunjucks-filter-limit-to.js'))

    return {
        dir: {
            input: "src",
            output: "public"
        }
    };
}