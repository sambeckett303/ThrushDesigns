Vue.component('store-view',
{
	data: function()
	{
		return {
			viewAllActive: true,
			allProducts: productsArray,
			products: productsArray
		};
	},
	methods:
	{
		goToProductDetails: function(product)
		{
			this.$router.push("/products/" + product.url);
		},
		filter: function(category)
		{
			var filteredProducts = [];
			for (var i = 0; i < this.allProducts.length; i++)
			{
				if (this.allProducts[i].category == category.name)
					filteredProducts.push(this.allProducts[i]);
			}
			this.products = filteredProducts;
			for (var i = 0; i < this.categories.length; i++)
			{
				this.categories[i].active = false;
			}
			category.active = true;
		},
		viewAll: function()
		{
			for (var i = 0; i < this.categories.length; i++)
			{
				this.categories[i].active = false;
			}
			this.viewAllActive = true;
			this.products = this.allProducts;
		}
	},
	computed:
	{
		categories: function()
		{
			var categories = [];
			for (var i = 0; i < this.allProducts.length; i++)
			{
				if (categories.indexOf(this.allProducts[i].category) == -1)
				{
					categories.push(this.allProducts[i].category);
				}
			}
			for (var i = 0; i < categories.length; i++)
			{
				categories[i] =
				{
					name: categories[i],
					active: false
				};
			}
			return categories;
		}
	},
	template:
		'<div id="pageGrid">'
		+	'<div>'
		+		'<div class="pageTitle">SHOP CATEGORIES</div>'
		+		'<div class="divideBar"></div>'
		+		'<div class="sectionLabel" @click="viewAll" :class="{ sectionActive: viewAllActive }">View All</div>'
		+		'<template v-for="category in categories">'
		+			'<div class="sectionLabel" @click="filter(category)" :class="{ sectionActive: category.active }">{{category.name}}</div>'
		+		'</template>'
		+	'</div>'
		+	'<div>'
		+		'<div id="productGrid">'
		+			'<div v-for="product in products">'
		+				'<div @click="goToProductDetails(product)" class="imageContainer">'
		+					'<img :src="product.images[0]">'
		+				'</div>'
		+				'<div>{{product.name}}</div>'
		+				'<div>{{product.price}}</div>'
		+			'</div>'
		+		'</div>'
		+	'</div>'
		+'</div>'
});