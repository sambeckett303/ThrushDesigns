const { Client } = require('pg');
const conString = process.env.DATABASE_URL;

class ProductsStoreManager
{
	async addProduct(addObj)
	{
		const client = new Client(conString);
		await client.connect();
		var queryStr = "insert into products ";
		var url =  encodeURI(addObj.name.replace(/ /g,"_"));
		var valueNames = "(name, description, category, price, url, images"
		var values = "('" + addObj.name.replace(/'/g, "''") + "', '" + addObj.description.replace(/'/g, "''") + "', '" + addObj.category.replace(/'/g, "''") + "', '" + addObj.price + "', '" + url + "', '{"
		for (var i = 0; i < addObj.images.length; i++)
		{
			if (i != 0)
				values += ', ';
			values += '"' + addObj.images[i] + '"'
		}
		values += "}'";
		if (addObj.dimensions)
		{
			valueNames += ", dimensions";
			values += ", '" + addObj.dimensions.replace(/'/g, "''") + "'";
		}
		if (addObj.weight)
		{
			valueNames += ", weight";
			values += ", '" + addObj.weight + "'";
		}
		valueNames += ") ";
		values += ")"
		queryStr += valueNames + "values " + values + " returning id";
		const res = await client.query(queryStr);
		await client.end();
		return res.rows[0].id;
	}

	async updateProduct(updateObj)
	{
		const client = new Client(conString);
		var queryStr = "update products set ";
		if (updateObj.name)
		{
			queryStr += "name = '" + updateObj.name.replace(/'/g, "''") + "',";
		}
		if (updateObj.description)
		{
			queryStr += "description = '" + updateObj.description.replace(/'/g, "''") + "',";
		}
		if (updateObj.category)
		{
			queryStr += "category = '" + updateObj.category.replace(/'/g, "''") + "',";
		}
		if (updateObj.dimensions)
		{
			queryStr += "dimensions = '" + updateObj.dimensions.replace(/'/g, "''") + "',";
		}
		if (updateObj.weight)
		{
			queryStr += "weight = '" + updateObj.weight.replace(/'/g, "''") + "',";
		}
		if (updateObj.price)
		{
			queryStr += "price = '" + updateObj.price + "',";
		}
		if (updateObj.images)
		{
			queryStr += "images = '{";
			for (var i = 0; i < updateObj.images.length; i++)
			{
				queryStr += '"' + updateObj.images[i] + '",';
			}
			// Remove last comma
			queryStr = queryStr.slice(0, -1);
			queryStr += "}',";
		}
		// Remove last comma
		queryStr = queryStr.slice(0, -1);
		queryStr += " where id = " + updateObj.id;
		console.log(queryStr);
		await client.connect();
		const res = await client.query(queryStr);
		await client.end();
		return;
	}

	async getProducts()
	{
		const client = new Client(conString);
		await client.connect();
		var queryStr = "select * from products";
		const res = await client.query(queryStr);
		await client.end();
		return res.rows;
	}

	async deleteProduct(id)
	{
		const client = new Client(conString);
		await client.connect();
		var queryStr = "delete from products where id = " + id;
		const res = await client.query(queryStr);
		await client.end();
		return;
	}
}

module.exports = new ProductsStoreManager;