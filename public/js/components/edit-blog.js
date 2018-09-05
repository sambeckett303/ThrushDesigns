Vue.component('edit-blog',
{
	data: function()
	{
		return {
			blogPartsArray: [],
			imageCaption: '',
			blogHTML: '',
			editingParagraph: false,
			filePreviewSrc: '',
			editingImage: false,
			isPublished: false,
			currentID: null,
			editTitle: false,
			newTitle: '',
			previewingBlog: false,
			blogs: [],
			showImageSection: false,
			showLinkBox: false,
			linkName: '',
			linkDestination: '',
			createBlogModal: false,
			paragraphModal: false,
			imageModal: false,
			loading: false,
			newParagraph: '',
			title: ''
		};
	},
	beforeMount: function()
	{
		this.blogs = blogsArray;
	},
	watch:
	{
		blogHTML: function()
		{
			this.loading = true;
			$.ajax(
			{
				url: '/blog',
				type: 'PUT',
				data:
				{
					id: this.currentID,
					content: this.blogHTML
				},
				success: function()
				{
					this.loading = false;
				}.bind(this)
			});
		}
	},
	methods:
	{
		triggerFileBrowser: function()
		{
			$('#newBlogImage').trigger('click');
		},
		setBlogHTML: function()
		{
			var blogStr = '';
			for (var i = 0; i < this.blogPartsArray.length; i++)
			{
				blogStr += this.blogPartsArray[i];
			}
			this.blogHTML = blogStr;
		},
		guidGenerator: function() {
		    var S4 = function() {
		       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		    };
		    return (S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4());
		},
		createBlog: function()
		{
			this.previewingBlog = false;
			this.blogPartsArray = [];
			this.title = '';
			this.createBlogModal = true;
		},
		addParagraph: function()
		{
			this.editingParagraph = false;
			this.newParagraph = '';
			this.paragraphModal = true;
		},
		addParagraphToHTML: function()
		{
			if (this.editingParagraph)
			{
				for (var i = 0; i < this.blogPartsArray.length; i++)
				{
					var blogPart = this.blogPartsArray[i];
					if (blogPart[0]+blogPart[1] == "<p")
					{
						var match = /id="(.*?)"/gm.exec(blogPart);
						if (match[1] == this.currentParagraphID)
						{
							this.blogPartsArray[i] = '<p id="' + this.currentParagraphID + '" class="blogParagraph">' + this.newParagraph + '</p>';
							break;
						}
					}
				}
				this.editingParagraph = false;
			}
			else
			{
				this.blogPartsArray.push('<p id="' + this.guidGenerator() + '" class="blogParagraph">' + this.newParagraph + '</p>');
			}
			this.setBlogHTML();
			this.newParagraph = '';
			this.paragraphModal = false;
		},
		editBlog: function(blog)
		{
			this.currentID = blog.id;
			this.title = blog.title;
			this.isPublished = (blog.published ? true : false);
			if (blog.content)
			{
				this.blogPartsArray = blog.content.match(/(<p|<div).*?<\/(div|p)>/gm);	
			}
			else
			{
				this.blogPartsArray = [];
			}
			this.previewingBlog = true;
		},
		startUpload: function()
		{
			var files = document.getElementById('newBlogImage').files;
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
			// TODO: change this function to be a mixin, call a callback in the if xhr == 200 statement
			// Use the mixim here and in edit-gallery component
			const xhr = new XMLHttpRequest();
			xhr.open('PUT', signedRequest);
			xhr.onreadystatechange = function()
			{
				if(xhr.readyState === 4)
				{
					if(xhr.status === 200)
					{
						var imageHTML = '<div id="' + this.guidGenerator() + '" class="imageSection"><img src="' + url + '" alt="' + this.imageCaption + '"><div class="imageCaption">' + this.imageCaption + '</div>'
						this.blogPartsArray.push(imageHTML);
						this.setBlogHTML();
						this.filePreviewSrc = '';
						this.imageCaption = '';
						this.imageModal = false;
					}
					else
					{
						alert('Could not upload file.');
					}
				}
			}.bind(this);
			xhr.send(file);
		},
		createTheBlog: function()
		{
			// TODO: need to add a new blog entry into the database here
			this.createBlogModal = false;
			this.loading = true;
			$.ajax(
			{
				url: '/blog',
				type: 'POST',
				data:
				{
					title: this.title
				},
				success: function(response)
				{
					this.loading = false;
					this.currentID = response.id;
					this.blogs.push(
					{
						id: this.currentID,
						title: this.title,
						content: ''
					});
					this.isPublished = false;
					this.previewingBlog = true;
				}.bind(this)
			})
		},
		deleteBlogPost: function()
		{
			this.loading = true;
			$.ajax(
			{
				url: '/blog',
				type: 'DELETE',
				data:
				{
					title: this.title
				},
				success: function()
				{
					this.loading = false;
					for (var i = 0; i < this.blogs.length; i++)
					{
						if (this.blogs[i].title == this.title)
						{
							this.blogs.splice(i, 1);
							break;
						}
					}
					this.title = '';
					this.blogHTML = '';
					this.paragraphModal = false;
					this.previewingBlog = false;
				}.bind(this)
			});
		},
		addLinkToParagraph: function()
		{
			this.newParagraph.trim();
			this.newParagraph += ' <a href="' + this.linkDestination + '">' + this.linkName + '</a>';
			this.linkDestination = '';
			this.linkName = '';
			this.showLinkBox = false;
		},
		isBlogActive: function(blog)
		{
			if (blog.title == this.title)
			{
				return true;
			}
			else
			{
				return false;
			}
		},
		editTheTitle: function()
		{
			this.editTitle = true;
			this.newTitle = this.title;
		},
		changeTitle: function()
		{
			this.title = this.newTitle;
			this.loading = true;
			$.ajax(
			{
				url: '/blog',
				type: 'PUT',
				data:
				{
					id: this.currentID,
					title: this.title
				},
				success: function()
				{
					this.loading = false;
				}.bind(this)
			});
			this.editTitle = false;
		},
		revertTitle: function()
		{
			this.newTitle = this.title;
			this.editTitle = false;
		},
		editBlogPart: function(blogPart)
		{
			if (blogPart[0]+blogPart[1] == "<p")
			{
				var match = /<p id="(.*?)".*>(.*)<\/p>/gm.exec(blogPart);
				this.currentParagraphID = match[1];
				this.newParagraph = match[2];
				this.paragraphModal = true;
				this.editingParagraph = true;
			}
			else
			{
				var match = /<div id="(.*?)".*><img src="(.*?)"><div class="imageCaption">(.*?)<\/div>/gm.exec(blogPart);
				this.currentParagraphID = match[1];
				this.filePreviewSrc = match[2];
				this.imageCaption = match[3];
				this.editingImage = true;
				this.imageModal = true;
			}
		},
		addImageToHTML: function()
		{
			if (this.editingImage)
			{
				var imageHTML = '<div id="' + this.currentParagraphID + '" class="imageSection"><img src="' + this.filePreviewSrc + '"><div class="imageCaption">' + this.imageCaption + '</div>'
				for (var i = 0; i < this.blogPartsArray.length; i++)
				{
					var blogPart = this.blogPartsArray[i];
					var match = /id="(.*?)"/gm.exec(blogPart);
					if (match[1] == this.currentParagraphID)
					{
						this.blogPartsArray[i] = imageHTML;
						break;
					}
				}
				this.setBlogHTML();
				this.imageModal = false;
			}
			else
			{
				this.startUpload();
			}
		},
		fileChosen: function(event)
		{
			this.filePreviewSrc = URL.createObjectURL(event.target.files[0]);
		},
		cancelImage: function()
		{
			this.filePreviewSrc = '';
			this.imageModal = false;
		},
		cancelParagraph: function()
		{
			this.paragraphModal = false;
		},
		deleteItem: function(idToDelete)
		{
			for (var i = 0; i < this.blogPartsArray.length; i++)
			{
				var blogPart = this.blogPartsArray[i];
				var match = /<(p|div) id="(.*?)".*/gm.exec(blogPart);
				var id = match[2];
				if (id == idToDelete)
				{
					this.blogPartsArray.splice(i, 1);
					break;
				}
			}
			this.setBlogHTML();
		},
		deleteBlogPart: function(blogPart)
		{
			var match = /<(p|div) id="(.*?)".*/gm.exec(blogPart);
			var tagType = match[1];
			var idToDelete = match[2];
			if (tagType == 'div')
			{
				// TODO: search for image src and delete from aws
				match = /.*<img src="(.*?)"/gm.exec(blogPart);
				var srcToDelete = match[1];
				this.loading = true;
				$.ajax(
				{
					url: 'image',
					type: 'DELETE',
					data:
					{
						url: srcToDelete
					},
					success: function(idToDelete)
					{
						this.deleteItem(idToDelete)
					}.bind(this, idToDelete)
				});
			}
			else
			{
				this.deleteItem(idToDelete);
			}
			
		},
		publishBlog: function()
		{
			var today = new Date();
			var publishDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			this.loading = true;
			$.ajax(
			{
				url: '/blog',
				type: 'PUT',
				data:
				{
					id: this.currentID,
					publishDate: publishDate
				},
				success: function()
				{
					// TODO: handle error
					this.loading = false;
					this.isPublished = true;
				}.bind(this)
			});
		}
	},
	template:
		`<div>
			<div id="blogGrid">
				<div>
					<div class="titleFont">BLOG POSTS</div>
					<hr>
					<div class="blogTitleList" :class="{ blogActive: isBlogActive(blog) }" v-for="blog in blogs" @click="editBlog(blog)">{{blog.title}}</div>
					<div class="thrushButton" @click="createBlog">NEW BLOG POST</div>
				</div>
				<div v-if="previewingBlog" style="position: relative;">
					<div class="titleFont">BLOG EDITOR</div>
					<div v-if="!isPublished" class="thrushButton" @click="publishBlog" style="position: absolute;right: 0;top: -25px;">PUBLISH BLOG POST</div>
					<hr>
					<table id="blogEditTable">
						<tr style="height: 84px;">
							<td style="width: 50px;">
								<div>
									<div v-if="editTitle">
										<div class="applyIcon" @click="changeTitle"></div>
										<div class="cancelIcon" @click="revertTitle"></div>
									</div>
									<div v-else style="width: 25px; margin: 0 auto;">
										<div class="pencilIcon" @click="editTheTitle"></div>
									</div>
								</div>
							</td>
							<td><input v-if="editTitle" v-model="newTitle" type="text"></input><h1 v-else>{{title}}</h1></td>
						</tr>
						<tr v-for="blogPart in blogPartsArray">
							<td>
								<div style="width: 50px; margin: 0 auto;">
									<div class="trashIcon" @click="deleteBlogPart(blogPart)"></div>
									<div class="pencilIcon" @click="editBlogPart(blogPart)"></div>
								</div>
							</td>
							<td><div v-html="blogPart"></div></td>
						</tr>
					</table>
					<hr>
					<div>
						<div class="thrushButton" @click="paragraphModal = true">ADD PARAGRAPH SECTION</div>
						<div class="thrushButton" @click="imageModal = true">ADD IMAGE SECTION</div>
						<div class="thrushButton" @click="deleteBlogPost">DELETE THIS BLOG POST</div>
					</div>
				</div>
			</div>
			<modal v-if="createBlogModal">
				<div slot="header">Enter a title (you can change this later)</div>
				<div slot="body">
					<input type="text" v-model="title"></input>
				</div>
				<div slot="footer">
					<div class="thrushButton" @click="createTheBlog">CREATE NEW BLOG POST</div>
				</div>
			</modal>
			<modal v-if="paragraphModal">
				<div slot="header">{{ editingParagraph ? "Edit Paragraph" : "Add Paragraph" }}</div>
				<div slot="body">
					<textarea v-model="newParagraph" rows="4" cols="50" placeholder="Enter a paragraph to be displayed on the page."></textarea>
					<div class="thrushButton" @click="showLinkBox = true" v-if="!showLinkBox">
						ADD LINK TO PARAGRAPH
					</div>
					<div v-if="showLinkBox">
						<input type="text" v-model="linkName" placeholder="Link Name (Google)"></input>
						<input type="text" v-model="linkDestination" placeholder="Link Destination (http://google.com)"></input>
						<div class="thrushButton" @click="addLinkToParagraph">ADD LINK</div>
					</div>
				</div>
				<div slot="footer">
					<div class="thrushButton" @click="addParagraphToHTML">{{ editingParagraph ? "Apply Changes" : "Add Paragraph To Blog"}}</div>
					<div class="thrushButton" @click="cancelParagraph">CANCEL</div>
				</div>
			</modal>
			<modal v-if="imageModal">
				<div slot="header">{{ editingImage ? "Edit Image Section" : "Add Image Section" }}</div>
				<div slot="body">
					<div v-if="filePreviewSrc">
						<img style="width: 100%;" id="blogImgPreview" :src="filePreviewSrc">
						<label>Image Caption</label>
						<input type="text" v-model="imageCaption">
					</div>
					<div v-else class="imageContainer addImage" @click="triggerFileBrowser">
						<div class="plusIcon" style="margin: auto;margin-top: 35px;"></div>
						<div style="text-align: center;">Browse For File</div>
					</div>
					<input id="newBlogImage" @change="fileChosen" type="file" name="file" style="display: none;"></input>
				</div>
				<div slot="footer">
					<div v-if="filePreviewSrc" class="thrushButton" @click="addImageToHTML">{{ editingImage ? "EDIT IMAGE SECTION" : "ADD IMAGE SECTION TO BLOG"}}</div>
					<div class="thrushButton" @click="cancelImage">CANCEL</div>
				</div>
			</modal>
			<modal v-if="loading">
				<div slot="header">Processing the request...</div>
				<div slot="body">
					<div class="loadingAnimation"></div>
				</div>
				<div slot="footer"></div>
			</modal>
		</div>`
});