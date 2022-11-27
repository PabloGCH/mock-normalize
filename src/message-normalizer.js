const norm = require("normalizr");

const authorSchema = new norm.schema.Entity("authors", {}, {idAttribute:"email"});

const messageSchema = new norm.schema.Entity("messages", {
	author: authorSchema
})

const chatSchema = new norm.schema.Entity("chat", {
	messages: [messageSchema]
})

function normalizeMessages(data) {
	return norm.normalize({id:"chat", messages: data}, chatSchema, {idAttribute:"id"});
}

module.exports = normalizeMessages
