var app;
var eventHub = new Vue();
$(document).ready(function() {
	app = new Vue(
	{
		el: '#adminapp',
		data: function()
		{
			return {
				sectionTabs: sectionsArray
			};
		},
		template:
			 '<div style="width: 90%; margin: 0 auto; padding-bottom: 60px;">'
			+	'<tabs>'
			+		'<tab name="Work" :defaultActive="true">'
			+			'<tabs>'
			+				'<tab name="+ Add">'
			+					'<edit-section></edit-section>'
			+				'</tab>'
			+				'<br>'
			+				'<tab v-for="tab in sectionTabs" :key="tab.name" :name="tab.name">'
			+					'<edit-section :sectionInfo="tab"></edit-section>'
			+				'</tab>'
			+			'</tabs>'
			+		'</tab>'
			+		'<tab name="Store">'
			+			'<edit-store></edit-store>'
			+		'</tab>'
			+		'<tab name="Blog">'
			+			'<edit-blog></edit-blog>'
			+		'</tab>'
			+	'</tabs>'
			+'</div>'
	});
});