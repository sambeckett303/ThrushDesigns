$(document).ready(function() {
	$('#navBar ul > li').click(function() {
		$('#mobileMenu').css('display', 'block');
		$('#mobileMenu').css('opacity', '0.95');
	});
	$('#closeMenu').click(function() {
		$('#mobileMenu').css('opacity', '0');
		setTimeout(function() {
			$('#mobileMenu').css('display', 'none');
		},350);
		//$('#mobileMenu').css('display', 'none');
	});
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	if (w < 480)
	{
		$('#navBar a').css('display', 'none');
	}
	else
	{
		$('#navBar ul > li').css('display', 'none');
	}
});