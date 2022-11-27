const fs = require('fs');

class MessageManager {

	constructor(fileDir) {
		this.fileDir = fileDir;
	}
	async readFile() {
		try {
			return JSON.parse(await fs.promises.readFile(this.fileDir, "utf-8"));
		}
		catch(err) {
			console.log(err);
		}
	}
	async getAll() {
		try {
			let file = await this.readFile();
			return file;
		}
		catch {
			console.log("Failed to get objects")
			return false;
		}
	}
	async writeFile(file) {
		try {
			await fs.promises.writeFile(this.fileDir, JSON.stringify(file, null, "	"));
		}
		catch {
			console.log("Failed to write file")
		}
	}
	async save(object) {
		try {
			let file = await this.readFile();
			let newObject = {
				email: object.email,
				date: object.date,
				message: object.message
			};
			if(newObject.message && newObject.email) {
				file.push(newObject);
				this.writeFile(file);
				return newObject;
			} else {
				throw("There was no message")
			}
		}
		catch(err) {
			if(err) {
				return err;
			}
			return {message:"Failed to save object", success:false};
		}
	}
}

module.exports = MessageManager;
