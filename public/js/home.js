var app;
$(window).load(function() {
	app = new Vue(
	{
		el: '#bodyContainer',
		data: function()
		{
			return {
				sections: sectionsArray
			};
		}
	});
});