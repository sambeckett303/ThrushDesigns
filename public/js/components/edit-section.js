function ProcessImages(images)
{
	if (images)
	{
		var imageArr = [];
		for (var i = 0; i < images.length; i++)
		{
			imageArr.push(
			{
				description: images[i][0],
				url: images[i][1]
			})
		}
		return imageArr;
	}
}

Vue.component('edit-section',
{
	props:
	{
		sectionInfo: Object
	},
	data: function()
	{
		return {
			name: (this.sectionInfo ? decodeURI(this.sectionInfo.name) : ''),
			id: (this.sectionInfo ? this.sectionInfo.id : ''),
			description: (this.sectionInfo ? this.sectionInfo.description : ''),
			primaryPhotoURL: (this.sectionInfo && this.sectionInfo.primaryphoto !== '' ? this.sectionInfo.primaryphoto : null),
			images: (this.sectionInfo ? ProcessImages(this.sectionInfo.images) : []),
			loading: false
		};
	},
	computed:
	{
		isNew: function ()
		{
			return (this.sectionInfo ? false : true)
		}
	},
	template:
		'<div id="editPageContainer" :class="{ moveDown: !isNew }">'
		+	'<div>'
		+		'<div id="editTitleContainer">'
		+			'<h2 v-if="!isNew">{{name}}</h2>'
		+			'<h2 v-else>Add Work Section</h2>'
		+		'</div>'
		+		'<div style="margin: 30px 45px;">'
		+			'<p>The section information will automatically save when you focus out of the text fields.</p>'
		+			'<label>Section Name:</label>'
		+			'<input @focusout="updateSectionInfo" id="pagename" type="text" placeholder="Enter section name" v-model="name"></input>'
		+			'<label>Section Description:</label>'
		+			'<textarea @focusout="updateSectionInfo" rows="4" cols="50" placeholder="Enter a description to be displayed on the page." v-model="description"></textarea>'
		+			'<div v-if="!isNew">'
		+				'<edit-gallery :id="id" :images="images" :primary="primaryPhotoURL"></edit-gallery>'
		+				'<hr>'
		+				'<div class="thrushButton" @click="deleteSection">Delete this section</div>'
		+			'</div>'
		+			'<div v-else style="margin-top: 10px;">'
		+				'<div class="thrushButton" @click="createSection">Create Section & Add Photos</div>'
		+			'</div>'
		+		'</div>'
		+	'</div>'
		+	'<modal v-if="loading">'
		+		'<div slot="header">Processing the request...</div>'
		+		'<div slot="body">'
		+			'<div class="loadingAnimation"></div>'
		+		'</div>'
		+		'<div slot="footer"></div>'
		+	'</modal>'
		+'</div>',
	methods:
	{
		createSection: function()
		{
			var name = this.name;
			var description = this.description;
			// Reset name and description
			this.name = '';
			this.description = '';
			this.loading = true;
			$.ajax(
			{
				url: '/section',
				type: 'POST',
				data:
				{
					name: name,
					description: description
				},
				success: function(response)
				{
					this.loading = false;
					sectionsArray.push({ id: response.id, name: name, description: description });
					Vue.nextTick(function()
					{
						$('li[id="' + name + '"]').click();
					});
				}
			});
		},
		updateSectionInfo: function()
		{
			if (!this.isNew)
			{
				$.ajax(
				{
					url: '/section',
					type: 'PUT',
					data:
					{
						id: this.id,
						name: this.name,
						description: this.description
					},
					success: function()
					{
						// TODO: figure out if there is something to do here, otherwise delete. Handle errors at least?
					}
				});
			}
		},
		deleteSection: function()
		{
			// TODO: first go through all images & delete them from AWS
			var imageArr = [];
			for (var i = 0; i < this.images.length; i++)
			{
				imageArr.push(this.images[i].url);
			}
			if (imageArr.length)
			{
				$.ajax(
				{
					url: '/image',
					type: 'DELETE',
					data:
					{
						urlArray: imageArr
					},
					success: function()
					{
						var pageToDelete = this.id;
						$.ajax(
						{
							url: '/section',
							type: 'DELETE',
							data:
							{
								id: this.id
							},
							success: function()
							{
								for (var i = 0; i < sectionsArray.length; i++)
								{
									if (sectionsArray[i].id == pageToDelete)
									{
										sectionsArray.splice(i, 1);
										break;
									}
								}
							}
						});
					}.bind(this)
				});
			}
			else
			{
				var pageToDelete = this.id;
				$.ajax(
				{
					url: '/section',
					type: 'DELETE',
					data:
					{
						id: this.id
					},
					success: function()
					{
						for (var i = 0; i < sectionsArray.length; i++)
						{
							if (sectionsArray[i].id == pageToDelete)
							{
								sectionsArray.splice(i, 1);
								break;
							}
						}
					}
				});
			}
		}
	}
});