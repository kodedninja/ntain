function Ntain() {
	this.version = "0.0.0";
	this.files = new Files();
	this.updater = new Updater();

	this.init = function() {
		this.setup_owner();
		this.files.show_files();
	}

	this.setup_owner = async function() {
    	await this.files.archive.getInfo().then(function (archive) {
			k.is_owner = archive.isOwner;
			k.files.setup_owner();
		});
  	}

	return this;
}
