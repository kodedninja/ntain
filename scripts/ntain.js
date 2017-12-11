function Ntain() {
	if (typeof DatArchive == 'undefined') {
		window.location = window.location + 'files';
		return null;
	}

	this.files = new Files();
	this.version = null;
	this.updater = new Updater();

	this.bigfile_el = document.querySelector('#bigfile');
	this.bigfile_file_el = document.createElement('div');
	this.bigfile_file_el.classList = 'file';
	this.bigfile_filename_el = document.createElement('span');
	this.bigfile_download_el = document.createElement('a'); this.bigfile_download_el.innerHTML = 'Download'; this.bigfile_download_el.classList = 'download';

	this.init = async function() {
		this.setup_owner();
		await this.files.show_files();

		if (window.location.href.indexOf('#') > -1) {
			var file = window.location.href.split('#')[1];
			var i = k.files.index_of_file(file)
			if (i > -1) {
				k.bigfile(k.files.files[i]);
			}
		}

		this.bigfile_file_el.appendChild(this.bigfile_filename_el);
		this.bigfile_file_el.appendChild(this.bigfile_download_el);
		this.bigfile_el.appendChild(this.bigfile_file_el);

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

	this.bigfile = function(file) {
		var body = document.getElementsByTagName('body')[0];
		body.classList = "bigfilemode";

		var close_button = document.querySelector('#bigfile .close-button');
		close_button.addEventListener('click', this.close_bigfile);

		//$('<a href="' + window.location.toString() + 'files/' + file + '" download="' + file + '">Download</a>').appendTo(this.bigfile_file_el);
		this.bigfile_filename_el.innerHTML = file.name;

		this.bigfile_download_el.href = 'files/' + file.name;
		this.bigfile_download_el.setAttribute('download' , file.name);

		if (file.name.match(/.(jpg|jpeg|png|gif)$/i)) {
			this.bigfile_file_el.style.backgroundImage = 'url(files/' + file.name + ')';
		}
	}

	this.close_bigfile = function(e) {
		var close_button = document.querySelector('#bigfile .close-button');
		close_button.removeEventListener('click', this);

		var body = document.getElementsByTagName('body')[0];
		body.removeAttribute('class');
	}

	return this;
}
