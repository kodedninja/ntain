function Updater() {

	this.check = async function() {
		if (k.is_owner) {
			var main = new DatArchive('dat://ntain-kodedninja.hashbase.io');

			var main_version = await main.readFile('/VERSION',{timeout: 2000}).then(console.log("Version checked!"));
			if (k.version != main_version) {
				var them = main_version.split('.');
				var me = k.version.split('.');
				for (var i = 0; i < 3; i++) {
					if (parseInt(them[i]) > parseInt(me[i])) {
						k.updater.add_link();
						break;
					}
				}
			}
		}
	}

	this.add_link = function() {
		var header = $('header');
		$('<a href="#" class="update-link">update available</a>').click(function(e) {
			e.preventDefault();
		}).appendTo(header);
	}

	return this;
}
