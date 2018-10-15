var app;
$(document).ready(function() {
	app = new Vue(
	{
		el: '#bodyContainer',
		data: function()
		{
			return {
				viewAllActive: true,
				sectionActive: false,
				currentName: '',
				sections: sectionsArray
			};
		},
		beforeMount: function()
		{
			for (var i = 0; i < this.sections.length; i++)
			{
				this.sections[i].active = false;
				var images = [];
				for (var j = 0; j < this.sections[i].images.length; j++)
				{
					var description = this.sections[i].images[j][0];
					var url = this.sections[i].images[j][1];
					var active = (j == 0 ? true : false);
					images.push(
					{
						active: active,
						description: description,
						url: url
					});
				}
				this.sections[i].images = images;
			}
		},
		methods:
		{
			getWorkHeight: function()
			{
				var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
				if (w < 500)
				{
					return '200px';
				}
				else
				{
					return '600px';
				}
			},
			viewAll: function()
			{
				this.viewAllActive = true;
				this.sectionActive = false;
			},
			goToSection: function(event, section)
			{
				this.sectionActive = true;
				this.viewAllActive = false;
				if (section)
				{
					var sectionName = section.name;
				}
				else
				{
					var sectionName = event.currentTarget.innerText;
				}
				for (var i = 0; i < this.sections.length; i++)
				{
					if (this.sections[i].active)
					{
						this.sections[i].active = false;
					}
				}
				for (var i = 0; i < this.sections.length; i++)
				{
					if (this.sections[i].name == sectionName)
					{
						this.currentName = this.sections[i].name;
						this.currentSectionImages = this.sections[i].images;
						this.currentSectionDescription = this.sections[i].description;
						this.sections[i].active = true;
						break;
					}
				}
			}
		}
	});
});