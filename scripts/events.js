document.addEventListener('keydown', function(e) {
	if (e.keyCode == 37) {
		// left arrow
		k.gallery_to_left();
		return;
	}

	if (e.keyCode == 39) {
		// right arrow
		k.gallery_to_right();
		return;
	}

	if (e.keyCode == 27) {
		// escape
		if (document.body.classList.value.indexOf('bigfilemode') != -1) {
			k.close_bigfile();
		} else if (document.body.classList.value.indexOf('bigimagemode') != -1) {
			k.close_bigimage();
		}
		return;
	}
});
