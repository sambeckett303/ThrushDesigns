Vue.component('slide-show',
{
	props:
	{
		name:
		{
			type: String,
			required: true
		}
	},
	computed:
	{
		getHref: function()
		{
			return '#' + this.name;
		}
	},
	mounted: function()
	{
		$('.carousel').carousel();
	},
	data: function()
	{
		return {
			images:
			[
				{
					src: '../img/car1.jpg'
				},
				{
					src: '../img/car2.jpg'
				},
				{
					src: '../img/car3.jpg'
				}
			]
		};
	},
	template:
		'<div :id="name" class="carousel slide" style="height: 100vh;" data-ride="carousel" data-interval="3000" data-pause="false">'
		+	'<ol class="carousel-indicators">'
		+	    '<li :data-target="getHref" data-slide-to="0" class="active"></li>'
		+	    '<li :data-target="getHref" data-slide-to="1"></li>'
		+	    '<li :data-target="getHref" data-slide-to="2"></li>'
		+	'</ol>'
       	+	'<div style="height: 100%;" class="carousel-inner">'
        +		'<div v-for="(img, index) in images" class="carousel-item" :class="{ active: index == 0 }">'
        +       	'<img :src="img.src" class="carouselImg">'
        +       '</div>'
        +   '</div>'
	  	+	'<a class="carousel-control-prev" :href="getHref" role="button" data-slide="prev">'
	    +		'<span class="carousel-control-prev-icon" aria-hidden="true"></span>'
	    +		'<span class="sr-only">Previous</span>'
	  	+	'</a>'
	  	+	'<a class="carousel-control-next" :href="getHref" role="button" data-slide="next">'
	    +		'<span class="carousel-control-next-icon" aria-hidden="true"></span>'
	    +		'<span class="sr-only">Next</span>'
	  	+	'</a>'
		+'</div>'
});