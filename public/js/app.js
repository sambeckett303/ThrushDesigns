var app;
$(document).ready(function() {
	app = new Vue(
	{
		el: '#pageGrid',
		data: function()
		{
			return {
			};
		},
		methods:
		{
			goToSection: function(target)
			{
				console.log('hello?');
			}
		}
	});
});