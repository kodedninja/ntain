function Files(root) {
	var t = this;
	this.archive = new DatArchive(window.location.toString());
	this.files = [];

	this.show_files = async function() {
		var file_list = document.getElementById('file-list');
		file_list.innerHTML = '';
		this.files = [];
		var files = await t.archive.readdir('/files', {recursive: true});
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			var stats = await t.archive.stat('/files/' + file);
			if (stats.isFile()) { // Directories not working, yet
				var elem = document.createElement('div');
				elem.classList = 'file';

				var name = document.createElement('span'); name.classList = 'file-name';
				name.innerHTML = file;
				elem.appendChild(name);

				if (file.match(/.(jpg|jpeg|png|gif)$/i)) {
					elem.style.backgroundImage = 'url(files/' + encodeURI(file) + ')';

					get_image_lightness('files/' + encodeURI(file), elem, function(el, b) {
						if (b < 120) {
							el.classList += ' dark';
						}
					});
				}

				var size = document.createElement('span'); size.classList = 'file-size data';
				size.innerHTML = stats.size + ' bytes';
				elem.appendChild(size);

				var download = document.createElement('a'); download.classList = 'download-link data';
				download.innerHTML = 'Download';
				download.href = window.location.toString().replace('#', '') + 'files/' + file;
				download.setAttribute('download', file);
				elem.appendChild(download);

				if (k.is_owner) {
					var del = document.createElement('a'); del.classList = 'delete-link data';
					del.href = '#';
					del.innerHTML = 'Delete';
					del.setAttribute('data-target', file);
					del.addEventListener('click', function(e) {
						e.preventDefault();
						k.files.delete_file(this.getAttribute('data-target'));
						var file_el = this.closest('.file');
						file_el.parentNode.removeChild(file_el);
					});
					elem.appendChild(del);
				}

				elem.addEventListener('click', function(e) {
					if (e.target.classList[0] == 'file') {
						k.bigfile(k.files.files[k.files.index_of_file(e.target.children[0].innerHTML)]);
					}
				});

				file_list.appendChild(elem);
				k.files.files.push({name: file, stats: stats});
			}
		}
	}

	this.delete_file = async function(filename) {
		await k.files.archive.unlink('/files/' + filename);
		await k.files.archive.commit();
	}

	this.version = async function() {
		k.version = await k.files.archive.readFile('/VERSION', {timeout: 2000});
	}

	this.drag = function(bool) {
      	if (bool) {
			document.body.classList = 'owner drag';
      	} else {
			document.body.classList = 'owner';
      	}
    }

    this.drag_over = function(e) {
      	e.preventDefault();
      	k.files.drag(true);
    }

    this.drag_leave = function(e) {
      	e.preventDefault();
      	k.files.drag(false);
    }

	this.drop = function(e) {
		e.preventDefault();
	    var files = e.dataTransfer.files, file = null;
		var i = 0;

		function next() {
			file = files[i];
	        reader.readAsArrayBuffer(file);
		}

		var reader = new FileReader();
		reader.onload = async function (e) {
			var result = e.target.result;
			await k.files.archive.writeFile('/files/' + file.name, result);
			await k.files.archive.commit();
			k.files.show_files();
			i++;
			if (i < files.length) next();
		}

		next();
		k.files.drag(false);
  	}

	this.setup_owner = function() {
		if (k.is_owner) {
			var body = document.querySelectorAll('body')[0];
			document.body.classList = 'owner';
			body.addEventListener('dragover',this.drag_over,false);
			body.addEventListener('dragleave',this.drag_leave,false);
			body.addEventListener('drop',this.drop,false);
		}
	}

	this.index_of_file = function(filename) {
		for (var i = 0; i < this.files.length; i++) {
			if (this.files[i].name == filename) return i;
		}
		return -1;
	}

	return this;
}

async function get_image_lightness(image_src, el, callback) {
	// not the best function because every image is loaded twice
	// it works for now
	var h = 50;

    var img = document.createElement("img");
    img.src = image_src;
    img.style.display = "none";
    document.body.appendChild(img);

    var colorSum = 0;

    img.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this,0,0);

        var imageData = ctx.getImageData(0,0,canvas.width,h);
        var data = imageData.data;
        var r,g,b,avg;

        for(var x = 0, len = data.length; x < len; x+=4) {
            r = data[x];
            g = data[x+1];
            b = data[x+2];

            avg = Math.floor((r+g+b)/3);
            colorSum += avg;
        }

        var brightness = Math.floor(colorSum / (this.width*h));
        callback(el, brightness);
    }
}

async function file_handler() {
	var file = document.querySelector('input[type=file]').files[0];
  	var reader = new FileReader();

  	reader.addEventListener("load", async function () {
		var content = reader.result.split(',')[1];
		await k.files.archive.writeFile('/files/' + file.name, content, 'base64');
		await k.files.archive.commit()
  	}, false);

  	if (file) {
    	reader.readAsDataURL(file);
  	}
}
