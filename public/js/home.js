var app;
$(document).ready(function() {
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