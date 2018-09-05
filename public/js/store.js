var app;
var eventHub = new Vue();

const routes = [
  { path: '/', component: Vue.component('store-view') },
  { path: '/products/:name', component: Vue.component('product-details') }
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
});

$(document).ready(function() {
	app = new Vue(
	{
		el: '#bodyContainer',
		router: router,
		data: function()
		{
			return {
				showNotification: false
			};
		},
		mounted: function()
		{
			this.$router.push('/');
		},
		created: function () {
		  eventHub.$on('cartItemAdded', this.doShowNotification);
		},
		methods: {
		  doShowNotification: function () {
		    this.showNotification = true;
		  }
		}
	});
});