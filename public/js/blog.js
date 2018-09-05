var app;
$(document).ready(function() {
	app = new Vue(
	{
		el: '#bodyContainer',
		methods:
		{
			getDate: function(dateStr)
			{
				var date = new Date(dateStr);
				return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
			},
			getContentPreview: function(content)
			{
				if (content)
				{
					return content.substring(0, content.indexOf("</p>") + 4);
				}
				else
				{
					return '';
				}
			},
			getBlogLink: function(url)
			{
				return "/blog/" + url;
			}
		},
		data: function()
		{
			return {
				blogTitles: blogTitles,
				blogs: blogsArray
			};
		}
	});
});