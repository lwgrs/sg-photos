const { DateTime } = require("luxon");


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

    eleventyConfig.addCollection("blog", function(collection) {
	    const coll = collection.getFilteredByTag("blog");
 
	    for(let i = 0; i < coll.length ; i++) {
		    const prevPost = coll[i-1];
		    const nextPost = coll[i + 1];

		  coll[i].data["prevPost"] = prevPost;
		  coll[i].data["nextPost"] = nextPost;
	}

	return coll;
});
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