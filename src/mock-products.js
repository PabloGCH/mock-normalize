const fake = require("@faker-js/faker")


function generateProducts(amount) {
	let products = [];
	for(let i = 0; i < amount; i++) {
		products.push({
			name: fake.faker.commerce.productName(),
			price: fake.faker.commerce.price(),
			imgUrl: fake.faker.image.cats()
		})
	}
	return products;
}

module.exports = generateProducts;
