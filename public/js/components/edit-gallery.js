Vue.component('edit-gallery',
{
	props:
	{
		id: Number,
		images: Array,
		primary: String
	},
	data: function()
	{
		return {
			primarySrc: this.primary,
			loading: false,
			fileID: 'newImage' + this.id
		};
	},
	methods:
	{
		addImage: function()
		{
			$('#'+this.fileID).trigger('click');
		},
		startUpload: function()
		{
			this.loading = true;
			var files = document.getElementById(this.fileID).files;
			var file = files[0];
			this.getSignedRequest(file);
		},
		getSignedRequest: function (file)
		{
		  const xhr = new XMLHttpRequest();
		  xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
		  xhr.onreadystatechange = function()
		  {
		    if(xhr.readyState === 4){
		      if(xhr.status === 200){
		        const response = JSON.parse(xhr.responseText);
		        this.uploadFile(file, response.signedRequest, response.url);
		      }
		      else{
		        alert('Could not get signed URL.');
		      }
		    }
		  }.bind(this);
		  xhr.send();
		},
		uploadFile: function(file, signedRequest, url)
		{
			const xhr = new XMLHttpRequest();
			xhr.open('PUT', signedRequest);
			xhr.onreadystatechange = function()
			{
				if(xhr.readyState === 4)
				{
					if(xhr.status === 200)
					{
						if (this.images == undefined)
						{
							this.images = [];
						}
						this.images.push(
						{
							url: url,
							description: ''
						});
						this.updateImages();
					}
					else
					{
						// TODO: make this a more user friendly alert message
						alert('Could not upload file.');
					}
				}
			}.bind(this);
			xhr.send(file);
		},
		updateImages: function()
		{
			$.ajax(
			{
				url: '/section',
				type: 'PUT',
				data:
				{
					id: this.id,
					images: (this.images.length ? this.images : "empty")
				},
				success: function()
				{
					this.loading = false;
				}.bind(this)
			});
		},
		removeImage: function(image)
		{
			this.loading = true;
			$.ajax(
			{
				url: 'image',
				type: 'DELETE',
				data:
				{
					url: image.url
				},
				success: function()
				{
					for (var i = 0; i < this.images.length; i++)
					{
						if (this.images[i].url == image.url)
						{
							this.images.splice(i, 1);
							break;
						}
					}
					this.updateImages();
				}.bind(this)
			});
			
		},
		markAsPrimary: function(image)
		{
			this.primarySrc = image.url;
			$.ajax(
			{
				url: '/section',
				type: 'PUT',
				data:
				{
					primaryPhoto: image.url,
					id: this.id
				}
			});
		},
		updateDescription: function(image)
		{
			$.ajax(
			{
				url: '/section',
				type: 'PUT',
				data:
				{
					id: this.id,
					images: this.images
				}
			});
		}
	},
	template:
		'<div>'
		+	'<label>Section Gallery Images:</label>'
		+	'<div class="gridWrapper">'
		+		'<div v-for="image in images" class="imageContainer">'
		+			'<img :src="image.url" style="max-height: 300px;max-width: 300px;margin: 0 auto;display: block;">'
		+			'<label>Image description:</label>'
		+			'<textarea rows="4" @focusout="updateDescription(image)" v-model="image.description" style="width: 90%;"></textarea>'
		+			'<div v-if="image.url != primarySrc" class="thrushButton" @click="markAsPrimary(image)">Use As Primary</div>'
		+			'<div v-else class="thrushButton">Current Primary</div>'
		+			'<div class="thrushButton" @click="removeImage(image)">Remove Image</div>'
		+		'</div>'
		+		'<div class="imageContainer addImage" @click="addImage">'
		+			'<div class="plusIcon" style="margin: auto;margin-top: 35px;"></div>'
		+			'<div style="text-align: center;">Add Image</div>'
		+			'<input :id="fileID" @change="startUpload" type="file" name="file" style="width: 0px;height: 0px;overflow: hidden;"></input>'
		+		'</div>'
		+	'</div>'
		+	'<modal v-if="loading">'
		+		'<div slot="header">Processing the request...</div>'
		+		'<div slot="body">'
		+			'<div class="loadingAnimation"></div>'
		+		'</div>'
		+		'<div slot="footer"></div>'
		+	'</modal>'
		+'</div>'
});