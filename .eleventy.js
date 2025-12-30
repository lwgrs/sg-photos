const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");


module.exports = function (eleventyConfig) {
  let options = {
    html: true, // Enable HTML tags in source
    breaks: true,  // Convert '\n' in paragraphs into <br>
    linkify: true // Autoconvert URL-like text to links
  };

    eleventyConfig.addPassthroughCopy("./src/css");
    eleventyConfig.addPassthroughCopy("./src/img");

    eleventyConfig.addFilter("readableDate", dateObj => {
      return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
    });
    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
eleventyConfig.addFilter('htmlDateString', (dateObj) => {
  return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
});

eleventyConfig.addFilter("justYear", (dateString) => {
  dateObj = new Date(dateString);
  return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy');
});

eleventyConfig.addPlugin(pluginRss, {
  posthtmlRenderOptions: {
    closingSingleTag: "default" // opt-out of <img/>-style XHTML single tags 
  }
});


eleventyConfig.addCollection("blog", function(collection) {
	const coll = collection.getFilteredByTag("blog")
  // enable post scheduling
  .filter(post => post.date <= new Date());
	  for(let i = 0; i < coll.length ; i++) {
		    const prevPost = coll[i-1];
		    const nextPost = coll[i + 1];

		coll[i].data["prevPost"] = prevPost;
		coll[i].data["nextPost"] = nextPost;
	}

	return coll;
});

// Create tag list
eleventyConfig.addCollection('tagsList', (collectionApi) => {
  const tagsSet = new Set()
  collectionApi.getAll().forEach((item) => {
    if (!item.data.tags) return
    item.data.tags
      .filter((tag) => !['blog'].includes(tag))
      .forEach((tag) => tagsSet.add(tag))
  })
  return [...tagsSet].sort((b, a) => b.localeCompare(a))
})

    return {
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      },
    };
  };