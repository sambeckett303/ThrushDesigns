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
			}
		},
		data: function()
		{
			return {
				blog: blog[0]
			};
		}
	});
});