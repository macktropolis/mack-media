const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const lodash = require("lodash");
const slugify = require("slugify");

/**
 * Get all unique key values from a collection
 *
 * @param {Array} collectionArray - collection to loop through
 * @param {String} key - key to get values from
 */
 function getAllKeyValues(collectionArray, key) {
    // get all values from collection
    let allValues = collectionArray.map((item) => {
      let values = item.data[key] ? item.data[key] : [];
      return values;
    });
  
    // flatten values array
    allValues = lodash.flattenDeep(allValues);
    // to lowercase
    allValues = allValues.map((item) => item.toLowerCase());
    // remove duplicates
    allValues = [...new Set(allValues)];
    // order alphabetically
    allValues = allValues.sort(function (a, b) {
      return a.localeCompare(b, "en", { sensitivity: "base" });
    });
    // return
    return allValues;
  }
  
  /**
   * Transform a string into a slug
   * Uses slugify package
   *
   * @param {String} str - string to slugify
   */
  function strToSlug(str) {
    const options = {
      replacement: "-",
      remove: /[&,+()$~%.'":*?<>{}]/g,
      lower: true,
    };
  
    return slugify(str, options);
  }

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

    // create blog categories collection
    eleventyConfig.addCollection("blogCategories", collection => {
        let allCategories = getAllKeyValues(
            collection.getFilteredByGlob("./src/blog/*.md"),
            "categories"
        );

        let blogCategories = allCategories.map((category) => ({
        title: category,
        slug: strToSlug(category),
        }));

        return blogCategories;
    });

    // Tags
    // --------------------------------------------------------
    
    // Create a list of tags, excluding certain tags
    function filterTagList(tags) {
        return (tags || []).filter(tag => [
            "all", 
            "nav", 
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
     eleventyConfig.addNunjucksFilter('limitTo', require('./src/js/filters/nunjucks-filter-limit-to.js'));

     eleventyConfig.addNunjucksFilter('include', require('./src/js/filters/includes.js'));

    return {
        dir: {
            input: "src",
            output: "public"
        }
    };
}