Vue.component('tabs',
{
	data: function()
	{
		return {
			tabs: []
		};
	},
	template:
		'<div>'
		+	'<ul class="tabContainer">'
		+		'<li :id="tab.name" v-for="tab in tabs" @click="tabClicked(tab)" :class="{ tabSelected: tab.active }" v-html="tab.name"></li>'
		+	'</ul>'
		+	'<slot></slot>'
		+'</div>',
	created: function()
	{
		this.tabs = this.$children;
	},
	methods:
	{
		tabClicked: function(selectedTab)
		{
			this.tabs.forEach(function (tab)
			{
				tab.active = tab.name == selectedTab.name;
			});
		}
	}
});

Vue.component('tab',
{
	props:
	{
		name: String,
		defaultActive:
		{
			type: Boolean,
			default: false
		}
	},
	data: function()
	{
		return {
			active: this.defaultActive
		};
	},
	template:
		'<div v-show="active"><slot></slot></div>'
});