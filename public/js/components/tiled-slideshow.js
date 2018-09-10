Vue.component('tiled-slideshow',
{
	props:
	{
		transition: String,
		width:
		{
			type: String,
			default: '95%'
		},
		repeat:
		{
			type: Boolean,
			default: false
		},
		withTitle:
		{
			type: Boolean,
			'default': false
		}
	},
	data: function()
	{
		return {
			inLoad: true,
			inTransition: false,
			picDelay: 3300,
			transitionPanels:
			[
				{
					id: 0,
					inTransition: false
				},
				{
					id: 1,
					inTransition: false
				},
				{
					id: 2,
					inTransition: false
				},
				{
					id: 3,
					inTransition: false
				},
				{
					id: 4,
					inTransition: false
				}
			],
			pics:
			[
				{
					active: true,
					src: "/img/slideshow1.JPG"
				},
				{
					active: false,
					src: "/img/slideshow2.jpg"
				},
				{
					active: false,
					src: "/img/slideshow3.JPG"
				}
			]
		};
	},
	mounted: function()
	{
		this.checkInterval();
	},
	computed:
	{
		height: function()
		{
			return window.innerHeight - 142 + 'px';
		},
		heightNumber: function()
		{
			return this.height.substring(this.height, this.height.length - 2);
		}
	},
	methods:
	{
		checkInterval: function()
		{
			setTimeout(function() {
				//this.inTransition = true;
				this.doTransition();
			}.bind(this), this.picDelay);
		},
		doTransition: function()
		{
			for (var i = 0; i < this.transitionPanels.length; i++)
			{
				setTimeout(function(i) {
					this.transitionPanels[i].inTransition = true;
				}.bind(this, i), i * 150);
			}
			setTimeout(function()
			{
				this.nextPictureActive();
			}.bind(this), 1500);
		},
		nextPictureActive: function()
		{
			for (var i = 0; i < this.pics.length; i++)
			{
				if (this.pics[i].active)
				{
					this.pics[i].active = false;
					if (i != this.pics.length - 1)
					{
						this.pics[i + 1].active = true;
					}
					else
					{
						this.pics[0].active = true;
					}
					break;
				}
			}
			for (var i = 0; i < this.transitionPanels.length; i++)
			{
				setTimeout(function(i) {
					this.transitionPanels[i].inTransition = false;
				}.bind(this, i), i * 150);
			}
			setTimeout(this.doTransition, this.picDelay);
		},
		getTransitionPanelHeight: function()
		{
			return (this.heightNumber / 5).toFixed(2) + 'px';
		},
		getTransitionPanelTop: function(index)
		{
			return index * (this.heightNumber / 5).toFixed(2) + 'px';
		}
	},
	template:
		'<div class="slideshowOuterContainer" :style="{ height: height, width: width }">'
		+	'<div class="slideshowInnerContainer">'
		+		'<transition-group name="slideshow">'
		+			'<div :key="panel.id" v-for="(panel, index) in transitionPanels" v-if="panel.inTransition" class="transitionPanel" :style="{ height: getTransitionPanelHeight(), \'margin-top\': getTransitionPanelTop(index) }"></div>'
		+		'</transition-group>'
		+		'<template v-for="pic in pics">'
		+			'<transition name="fade">'
		+				'<img v-if="pic.active" class="slideshowImg" :src="pic.src">'
		+			'</transition>'
		+		'</template>'
		+	'</div>'
		+'</div>'
});