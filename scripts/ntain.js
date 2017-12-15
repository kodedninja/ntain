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

	this.bigimage_el = document.getElementById('bigimage');
	this.bigimage_image_el = document.createElement('img');

	this.mode = '';
	this.current_file = null;

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

		this.bigimage_el.appendChild(this.bigimage_image_el);
		document.getElementById('gallery-left').addEventListener('click', this.gallery_to_left);
		document.getElementById('gallery-right').addEventListener('click', this.gallery_to_right);

		await this.files.version();
		document.querySelector('.version').innerHTML = this.version;

		if (k.is_owner) await this.updater.check();
	}

	this.setup_owner = async function() {
    	await this.files.archive.getInfo().then(function (archive) {
			k.is_owner = archive.isOwner;
			k.files.setup_owner();
		});
  	}

	this.bigfile = function(file) {
		this.current_file = file;
		if (file.name.match(/.(jpg|jpeg|png|gif)$/i)) {
			document.body.classList += ' bigimagemode';

			var close_button = document.querySelector('#bigimage .close-button');
			close_button.addEventListener('click', this.close_bigimage);

			this.bigimage_image_el.src = 'files/' + file.name;
			this.mode = 'bigimage';
		} else {
			document.body.classList += " bigfilemode";

			var close_button = document.querySelector('#bigfile .close-button');
			close_button.addEventListener('click', this.close_bigfile);

			//$('<a href="' + window.location.toString() + 'files/' + file + '" download="' + file + '">Download</a>').appendTo(this.bigfile_file_el);
			this.bigfile_filename_el.innerHTML = file.name;

			this.bigfile_download_el.href = 'files/' + file.name;
			this.bigfile_download_el.setAttribute('download' , file.name);
			this.mode = 'bigfile';
		}
	}

	this.change_bigimage = function(file) {
		this.current_file = file;
		this.bigimage_image_el.src = 'files/' + file.name;
	}

	this.close_bigfile = function(e) {
		var close_button = document.querySelector('#bigfile .close-button');
		close_button.removeEventListener('click', this);


		if (document.body.classList.value.indexOf('owner') != -1) document.body.classList = 'owner';
		else document.body.removeAttribute('class');

		this.mode = '';
		this.current_file = null;
	}

	this.close_bigimage = function(e) {
		var close_button = document.querySelector('#bigimage .close-button');
		close_button.removeEventListener('click', this);

		if (document.body.classList.value.indexOf('owner') != -1) document.body.classList = 'owner';
		else document.body.removeAttribute('class');

		this.mode = '';
		this.current_file = null;
	}

	this.gallery_to_left = function(e) {
		if (k.mode == 'bigimage') {
			if (e) e.preventDefault();
			var id = k.files.files.indexOf(k.current_file);

			// find the previous image
			id--;
			while (id >= 0) {
				if (k.files.files[id].name.match(/.(jpg|jpeg|png|gif)$/i)) {
					k.change_bigimage(k.files.files[id]);
					break;
				}
				id--;
			}
		}
	}

	this.gallery_to_right = function(e) {
		if (k.mode == 'bigimage') {
			if (e) e.preventDefault();
			var id = k.files.files.indexOf(k.current_file);

			// find the previous image
			id++;
			while (id < k.files.files.length) {
				if (k.files.files[id].name.match(/.(jpg|jpeg|png|gif)$/i)) {
					k.change_bigimage(k.files.files[id]);
					break;
				}
				id++;
			}
		}
	}

	return this;
}
