function Ntain() {
	this.files = new Files();
	this.version = null;
	this.updater = new Updater();

	this.init = async function() {
		this.setup_owner();
		this.files.show_files();
		await this.files.version();
		$('.version').text(this.version);

		if (k.is_owner) await this.updater.check();
	}

	this.setup_owner = async function() {
    	await this.files.archive.getInfo().then(function (archive) {
			k.is_owner = archive.isOwner;
			k.files.setup_owner();
		});
  	}

	return this;
}
