var app;
$(document).ready(function() {
	app = new Vue(
	{
		el: '#bodyContainer',
		methods:
		{
			sendEmail: function()
			{
				if (this.name && this.email && this.message)
				{
					this.loading = true;
					$.ajax('/sendemail',
					{
						data:
						{
							name: this.name,
							email: this.email,
							message: this.message,
						},
						success: function()
						{
							this.loading = false;
							this.showModal = true;
						}.bind(this)
					});
				}
			},
			sectionClicked: function(section)
			{
				for (var i = 0; i < this.aboutSections.length; i++)
				{
					this.aboutSections[i].active = false;
				}
				section.active = true;
			}
		},
		data: function()
		{
			return {
				name: '',
				email: '',
				message: '',
				loading: false,
				showModal: false,
				aboutSections:
				[
					{ title: 'About Thrush Designs', active: true },
					{ title: 'Events', active: false },
					{ title: 'Contact Info', active: false }
				]
			};
		}
	});
});