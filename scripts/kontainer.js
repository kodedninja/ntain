function Kontainer() {
	this.files = new Files('/files');

	this.files.show_files();

	return this;
}
