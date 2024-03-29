Vue.component('cart-notification',
{
	props:
	{
		show: Boolean
	},
	template:
		`
		<div v-if="show" id="notificationContainer">
			<div id="successIcon"></div>
			<div id="cartMessage">Successfully added item to your cart.</div>
			<a href="/cart"><div class="thrushButton">GO TO CART</div></a>
		</div>
		`
});