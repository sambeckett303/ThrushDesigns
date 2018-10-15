var app;
window.onload = function()
{
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
};