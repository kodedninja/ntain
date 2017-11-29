function Files(root) {
	var t = this;
	this.archive = new DatArchive(window.location.toString());
	this.root = '/';
	if (root) this.root = root;

	this.show_files = async function() {
		$('#file-list').empty();
		var files = await t.archive.readdir('/files', {recursive: true});
		files.forEach(async function(file) {
			var stats = await t.archive.stat('/files/' + file);
			var elem = $('<div class="file">'+file+'</div>');
			var download = $('<a href="' + window.location.toString() + 'files/' + file + '" download="' + file + '" class="download-link">Download</a>').appendTo(elem);
			$('#file-list').append(elem);
		});
	}

	this.drag = function(bool) {
      	if (bool) {
        	$('body').addClass('drag')
      	} else {
        	$('body').removeClass('drag')
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
	    var files = e.dataTransfer.files;
	    if (files.length === 1) {
	    	var file = files[0];
	    	var type = file.type;

	        var reader = new FileReader();
	        reader.onload = async function (e) {
	          	var result = e.target.result;

	          	await k.files.archive.writeFile('/files/' + file.name, result);
	          	await k.files.archive.commit();
				k.files.show_files();
	        }
	        reader.readAsArrayBuffer(file);
		}
		k.files.drag(false);
  	}

	var body = document.querySelectorAll('body')[0];
	body.addEventListener('dragover',this.drag_over,false);
    body.addEventListener('dragleave',this.drag_leave,false);
    body.addEventListener('drop',this.drop,false);

	return this;
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
