const socket = io();
const content = document.getElementById("content");
let currentUserEmail = "";
//HANDLEBARS HELPERS
Handlebars.registerHelper("compareStrings", (a, b, options) => {
	return a == b ? options.fn(this) : options.inverse(this);
})
//NORMALIZER SCHEMAS
const authorSchema = new normalizr.schema.Entity("authors", {}, {idAttribute:"email"});

const messageSchema = new normalizr.schema.Entity("messages", {
	author: authorSchema
})

const chatSchema = new normalizr.schema.Entity("chat", {
	messages: [messageSchema]
})


//FUNCTIONS

const randomProducts = async() => {

	let data = await fetch("/api/products-test");
	data = await data.json();
	const response = await fetch("../templates/random.handlebars");
	const result = await response.text();
	const template = Handlebars.compile(result);
	const html = template({products: data});
	return html;
}

const productForm = async() => {
	const response = await fetch("../templates/form.handlebars");
	const result = await response.text();
	const template = Handlebars.compile(result);
	const html = template();
	return html;
}

const productTable = async(data) => {
	const response = await fetch("../templates/products.handlebars");
	const result = await response.text();
	const template = Handlebars.compile(result);
	const html = template(data)
	return html;
}

const productFormSubmit = () => {
	const form = document.getElementById("product-form");
	const inputs = form.getElementsByTagName("input");
	let newProduct = {
		name: inputs[0].value,
		price: inputs[1].value,
		imgUrl: inputs[2].value
	};
	socket.emit("newProduct", newProduct)
	setTimeout(() => {
		window.location.replace("stock")
	}, 500)
}

const chatSection = async(data, user) => {
	console.log(data)
	Object.assign(data, {user: user})
	const response = await fetch("../templates/chat.handlebars");
	const result = await response.text();
	const template = Handlebars.compile(result);
	const html = template(data);
	return html;
}

//EVENTS
const sendMessage = () => {
	currentUserEmail = document.getElementById("email").value;
	let message = document.getElementById("message").value;
	let date = new Date();
	let newMessage = {
		author: {
			email: currentUserEmail,
		},
		date: date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString() + " - " + date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString(),
		message: message
	}
	socket.emit("newMessage", newMessage);
}


//ROUTES
if(window.location.pathname == "/stock") {
	socket.on("products", data => {
		productTable(data).then(res => {
			content.innerHTML = res;
		})
	})
}
if(window.location.pathname == "/random") {
	randomProducts().then(res => {
		content.innerHTML = res;
	})
}
if(window.location.pathname == "/form") {
	productForm().then(res => {
		content.innerHTML = res;
	})
}
if(window.location.pathname == "/chat") {
	socket.on("messages", data => {
		let denormData = normalizr.denormalize(data.result, chatSchema,data.entities); 
		chatSection(denormData, currentUserEmail).then(res => {
			content.innerHTML = res;
			document.getElementById("email").value = currentUserEmail;
			let messageBox = document.getElementById("message-box");
			messageBox.scrollTop = messageBox.scrollHeight;
		})
	})
}


