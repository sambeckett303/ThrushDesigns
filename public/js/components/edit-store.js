Vue.component('edit-store',
{
	data: function()
	{
		return {
			loading: false,
			productModal: false,
			editingProduct: false,
			currentImage: 'https://www.image.ie/images/no-image.png',
			productName: '',
			productDescription: '',
			productCategory: '',
			productDimensions: '',
			productWeight: '',
			dollars: '',
			cents: '',
			productImages: [],
			newProductImages: [],
			products: []
		};
	},
	methods:
	{
		cancelModal: function()
		{
			this.productName = '';
			this.productDescription = '';
			this.productDimensions = '';
			this.productCategory = '';
			this.productWeight = '';	
			this.dollars = '';
			this.cents = '';
			this.productImages = [];
			this.productModal = false;
		},
		triggerFileBrowser: function()
		{
			$('#newProductImage').trigger('click');
		},
		fileChosen: function()
		{
			var files = document.getElementById('newProductImage').files;
			var file = files[0];
			this.newProductImages.push({ file: file, fileUploaded: false, preview: URL.createObjectURL(file) });
		},
		startUploads: function()
		{
			var done = true;
			for (var i = 0; i < this.newProductImages.length; i++)
			{
				if (!this.newProductImages[i].fileUploaded)
				{
					done = false;
					this.newProductImages[i].fileUploaded = true;
					this.getSignedRequest(this.newProductImages[i].file);
					break;
				}
			}
			if (done)
			{
				this.saveProduct();
			}
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
						this.productImages.push(url);
						this.startUploads();	
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
		removeImage: function(imageUrl)
		{
			// TODO: make ajax request to delete image
		},
		removeNewImage: function(imageObj)
		{
			for (var i = 0; i < this.newProductImages.length; i++)
			{
				if (this.newProductImages[i].file == imageObj.file)
				{
					this.newProductImages.splice(i, 1);
					break;
				}
			}
		},
		confirmModal: function()
		{
			// TODO: first go through all the newProductImages array and upload it to AWS.
			// Push the url into this.productImages. Pop the elements from this.newProductImages.
			if (this.newProductImages.length)
			{
				this.loading = true;
				this.startUploads();
			}
			else
			{
				this.saveProduct();
			}
			
		},
		editProduct: function(product)
		{
			this.editingProduct = true;
			this.currentID = product.id;
			this.productImages = product.images;
			this.productName = product.name;
			this.productDescription = product.description;
			this.productCategory = product.category;
			this.dollars = product.price.substring(1,3);
			this.cents = product.price.substring(4,6);
			this.productDimensions = product.dimensions;
			this.productWeight = product.weight.substring(0, product.weight.length - 3).trim();
			this.productModal = true;
		},
		saveProduct: function()
		{
			var weight = this.productWeight + " lbs";
			var price = "$" + this.dollars + "." + this.cents;
			var updateData =
			{
				name: this.productName,
				description: this.productDescription,
				category: this.productCategory,
				dimensions: this.productDimensions,
				weight: weight,
				price: price,
				images: this.productImages
			};
			if (this.editingProduct)
			{
				var requestType = 'PUT';
				updateData.id = this.currentID;
			}
			else
			{
				var requestType = 'POST';
			}
			this.loading = true;
			$.ajax(
			{
				url: '/product',
				type: requestType,
				data: updateData,
				success: function(updateData)
				{
					this.loading = false;
					if (this.editingProduct)
					{
						for (var i = 0; i < this.products.length; i++)
						{
							if (this.products[i].id == this.currentID)
							{
								this.products[i] = updateData;
								break;
							}
						}
					}
					else
					{
						this.products.push(updateData);
					}
					this.productName = '';
					this.productDescription = '';
					this.productDimensions = '';
					this.productCategory = '';
					this.productWeight = '';	
					this.dollars = '';
					this.cents = '';
					this.productImages = [];
					this.productModal = false;
				}.bind(this, updateData)
			});
		},
		deleteProduct: function(product)
		{
			var imageArr = [];
			for (var i = 0; i < product.images.length; i++)
			{
				imageArr.push(product.images[i]);
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
					success: function(product)
					{
						var productToDelete = product.id;
						$.ajax(
						{
							url: '/product',
							type: 'DELETE',
							data:
							{
								id: product.id
							},
							success: function()
							{
								for (var i = 0; i < productsArray.length; i++)
								{
									if (productsArray[i].id == productToDelete)
									{
										productsArray.splice(i, 1);
										break;
									}
								}
							}
						});
					}.bind(this, product)
				});
			}
			else
			{
				var productToDelete = this.product.id;
				$.ajax(
				{
					url: '/product',
					type: 'DELETE',
					data:
					{
						id: this.id
					},
					success: function()
					{
						for (var i = 0; i < productsArray.length; i++)
						{
							if (productsArray[i].id == pageToDelete)
							{
								productsArray.splice(i, 1);
								break;
							}
						}
					}
				});
			}
		}
	},
	beforeMount: function()
	{
		this.products = productsArray;
	},
	computed:
	{
		categories: function()
		{
			var categories = [];
			for (var i = 0; i < this.products.length; i++)
			{
				if (categories.indexOf(this.products[i].category) == -1)
				{
					categories.push(this.products[i].category);
				}
			}
			return categories;
		}
	},
	template:
	`<div>
		<div class="thrushButton" @click="productModal = true">ADD PRODUCT</div>
		<div id="storeGrid">
			<div>
				<div class="titleFont">PRODUCT CATEGORIES</div>
				<hr>
				<div v-for="category in categories">{{category}}</div>
			</div>
			<div>
				<div class="titleFont">PRODUCTS</div>
				<hr>
				<div id="adminProductGrid">
					<div v-for="product in products">
						<div class="imageContainer">
							<img :src="product.images[0]">
						</div>
						<div>{{product.name}}</div>
						<div>{{product.price}}</div>
						<div><div class="thrushButton" @click="editProduct(product)">EDIT PRODUCT</div></div>
						<div><div class="thrushButton" @click="deleteProduct(product)">DELETE PRODUCT</div></div>
					</div>
				</div>
			</div>
		</div>
		<modal v-if="productModal" width="800px">
			<div slot="header">{{editingProduct ? "Edit Product" : "Add Product"}}</div>
			<div slot="body">
				<div id="productModalGrid">
					<div>
						<label>Name</label>
						<input type="text" v-model="productName"></input>
						<label>Description</label>
						<textarea v-model="productDescription" style="width: 98%;"></textarea>
						<label>Category</label>
						<input type="text" v-model="productCategory"></input>
						<label>Dimensions</label>
						<input type="text" v-model="productDimensions"></input>
						<label>Weight</label>
						<input type="text" size="17" v-model="productWeight"></input>&nbsp;lbs
						<label>Price</label>
						$&nbsp;<input type="text" size="2" v-model="dollars"></input>&nbsp;.&nbsp;<input type="text" size="2" v-model="cents"></input>
					</div>
					<div style="max-height: 430px; overflow: auto;">
						<label>Images</label>
						<div id="productImageGrid">
							<div v-for="productImage in productImages">
								<img :src="productImage">
								<div class="cancelIcon" style="position: absolute; right: 0; top: 0;" @click="removeImage(productImage)"></div>
							</div>
							<div v-for="newImage in newProductImages">
								<img :src="newImage.preview">
								<div class="cancelIcon" style="position: absolute; right: 0; top: 0;" @click="removeNewImage(newImage)"></div>
							</div>
							<div class="addImage" @click="triggerFileBrowser">
								<div class="plusIcon" style="margin: auto;margin-top: 35px;"></div>
								<div style="text-align: center;">Add Image</div>
								<input id="newProductImage" @change="fileChosen" type="file" name="file" style="display: none;"></input>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div slot="footer">
				<div class="thrushButton" @click="confirmModal">{{editingProduct ? "Edit Product" : "Add Product"}}</div>
				<div class="thrushButton" @click="cancelModal">Cancel</div>
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