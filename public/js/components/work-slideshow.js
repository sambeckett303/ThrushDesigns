Vue.component('work-slideshow',
{
	props:
  {
  	width:
    {
    	type: String,
      default: '100%'
    },
    height:
    {
    	type: String,
      default: '100%'
    },
    pics: Array
  },
	data: function() {
    return {
        transitionName: 'nextslide',
        activeDescription: '',
        hasDescription: false,
        images: this.pics
     }
  },
  watch:
  {
    pics: function(newPics)
    {
      this.images = newPics;
      this.images[0].active = true;
      if (this.activeDescription)
        this.activeDescription = this.images[0].description;
    }
  },
  computed:
  {
    imageContainerHeight: function()
    {
      return this.height.substring(0, this.height.length - 2) - 10 + 'px';
    }
  },
  mounted: function()
  {
    if (this.images[0] && this.images[0].description)
    {
      this.activeDescription = this.images[0].description;
    }
  },
  methods:
  {
  	prevImage: function()
    {
    	this.transitionName = 'prevslide';
      for (var i = 0; i < this.images.length; i++)
      {
      	if (this.images[i].active)
        {
        	this.images[i].active = false;
        	if (i == 0)
          {
          	this.images[this.images.length - 1].active = true;
            if (this.activeDescription)
              this.activeDescription = this.images[this.images.length - 1].description;
            break;
          }
          else
          {
          	this.images[i-1].active = true;
            if (this.activeDescription)
              this.activeDescription = this.images[i-1].description;
            break;
          }
        }
      }
    },
  	nextImage: function()
    {
    	this.transitionName = 'nextslide';
    	for (var i = 0; i < this.images.length; i++)
      {
      	if (this.images[i].active)
        {
        	this.images[i].active = false;
        	if (i == this.images.length - 1)
          {
          	this.images[0].active = true;
            if (this.activeDescription)
              this.activeDescription = this.images[0].description;
            break;
          }
          else
          {
          	this.images[i+1].active = true;
            if (this.activeDescription)
              this.activeDescription = this.images[i+1].description;
            break;
          }
        }
      }
    }
  },
	template:
        '<div>' 
          +'<div :style="{ width: width, height: height }" class="workSlideshowContainer">'
  				+		'<transition-group :name="transitionName">'
          +		   '<template v-for="image in images">'
          +         '<div v-if="image.active" v-bind:key="image.url">'
          +			      '<div class="imageContainer" :style="{height: imageContainerHeight}">'
          +             '<img :src="image.url">'
          +           '</div>'
          +           '<p class="imageDescription" v-html="image.description"></p>'
          +         '</div>'
          +		   '</template>'
          +		'</transition-group>'
          +   '<div style="position: relative;" :style="{ height: imageContainerHeight }">'
          +		   '<div v-if="images.length > 1" class="prevIcon" @click="prevImage"></div>'
          +		   '<div v-if="images.length > 1" class="nextIcon" @click="nextImage"></div>'
          +   '</div>'
  				+ '</div>'
          //+ '<p v-if="activeDescription" style="padding-top: 20px;width: 90%;margin: 0 auto; text-align: center;">{{activeDescription}}</p>'
          +'</div>'
});