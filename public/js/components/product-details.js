Vue.component('product-details',
{
	data: function()
	{
		return {
			loading: false,
			showModal: false,
			quantity: 1,
			product: {},
			images: []
		};
	},
	mounted: function()
	{
		for (var i = 0; i < productsArray.length; i++)
		{
			if (productsArray[i].url == this.$route.params.name)
			{
				this.product = productsArray[i];
				break;
			}
		}
		for (var i = 0; i < this.product.images.length; i++)
		{
			var imgObj = { url: this.product.images[i], active: false };
			this.images.push(imgObj);
		}
	},
	methods:
	{
		addOne: function()
		{
			this.quantity += 1;
		},
		subtractOne: function()
		{
			if (this.quantity > 1)
				this.quantity -= 1;
		},
		getHeight: function()
		{
			var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			if (w < 500)
			{
				return '400px';
			}
			else
			{
				return '600px';
			}
		},
		addToCart: function()
		{
			// TODO: send request to server to add item to session cart, upon success, show dialog that says item successfully added, continue shopping or go to cart? 
			this.loading = true;
			$.ajax('/addtocart',
			{
				type: 'POST',
				data:
				{
					id: this.product.id,
					quantity: this.quantity
				},
				success: function()
				{
					this.loading = false;
					this.$router.push('/');
					eventHub.$emit('cartItemAdded');
					Vue.nextTick(function()
					{
						$(this).scrollTop(0);
					});
				}.bind(this)
			});
		}
	},
	template:
		'<div id="detailsGrid">'
		+	'<work-slideshow :pics="images" :height="getHeight()"></work-slideshow>'
		+	'<div>'
		+		'<div class="pageTitle">PRODUCT DETAILS</div>'
		+		'<div class="divideBar"></div>'
		+		'<div class="detailsSection">'
		+			'<div id="productName">{{product.name}}</div>'
		+			'<p>{{product.description}}</p>'
		+			'<div style="margin-top: 50px;font-weight: bold;font-size: 18px;">{{product.price}}</div>'
		+			'<div style="font-weight: bold;font-size: 20px;">Details</div>'
		+			'<div style="margin-top: 15px;">{{product.dimensions}}</div>'
		+			'<div style="margin-top: 15px;">{{product.weight}}</div>'
				
		+			'<div style="margin-top: 60px;">'
		+				'<div class="product-quantity">'
		+			   		'<div style="font-size: 14px;margin-bottom: 2px;">QUANTITY</div>'
		+		        	'<button type="button" style="background: #e6e6e6;padding: 10px;margin: 10px 10px 0px 0px;" aria-label="Subtract one" @click="subtractOne" :disabled="quantity == 1"><span>&#8722;</span></button>'
		+			    	'<input data-min="1" v-model="quantity" data-max="0" type="text" name="quantity" value="1" readonly="true" style="">'
		+		        	'<button type="button" style="background: #e6e6e6;padding: 10px;margin: 10px 0px 0px 10px;" aria-label="Add one" @click="addOne"><span>&#43;</span></button>'
		+				'</div>'
		+				'<div @click="addToCart" style="margin-top: 40px;" class="thrushButton">ADD TO MY CART</div>'
		+		'</div>'
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