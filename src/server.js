// IMPORTS
const express = require("express");
const path = require("path");
const fakeProducts = require("./mock-products");
const msgNorm = require("./message-normalizer");
const Container = require("./container.js");
const MessageManager = require("./messageManager.js");
const {Server: IOServer} = require("socket.io");
const {Server: HttpServer} = require("http");
//GLOBAL VARIABLES
const app= express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer)
const TEMPLATEFOLDER = path.join(__dirname, "public/templates");
const container = new Container("products.json");
const messageManager = new MessageManager("message-history.json");
//HANDLEBARS
const HANDLEBARS = require("express-handlebars");
app.engine("handlebars", HANDLEBARS.engine())
app.set("views", TEMPLATEFOLDER)
app.set("view engine", "handlebars")
//APP INIT CONF
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
httpServer.listen(4000, ()=>{"server listening on port 4000"});


app.get("/api/products-test", (req, res) => {
	res.send(fakeProducts(5))
})

app.get("/*", (req, res) => {
	res.sendFile("public/client/index.html", {root: __dirname})
})



//WEBSOCKETS
io.on("connection", (socket) => {
	container.getAll().then(products => {
		socket.emit("products", {products: products})
	})
	messageManager.getAll().then(messages => {
		socket.emit("messages", msgNorm(messages))
	})
	socket.on("newProduct", data => {
		let product = data;
		Object.assign(product, {price: parseInt(product.price)});
		container.save(product).then(() => {
			container.getAll().then(products => {
				io.sockets.emit("products", {products: products})
			})
		})
	})
	socket.on("newMessage", data => {
		messageManager.save(data).then(() => {
			messageManager.getAll().then(messages => {
				io.sockets.emit("messages", msgNorm(messages))
			})
		})
	})
})




