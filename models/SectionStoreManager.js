const { Client } = require('pg');
const conString = process.env.DATABASE_URL;

class SectionStoreManager
{
	async addSection(addObj)
	{
		const client = new Client(conString);
		await client.connect();
		var url = encodeURI(addObj.name.replace(/ /g,"_"));
		var queryStr = "insert into sections (name, description, url) values ('"
                            + addObj.name + "', '" + addObj.description + "', '" + url + "')";
		console.log(queryStr);
		const res = await client.query(queryStr);
		await client.end();
		return;
	}

	async updateSection(updateObj)
	{
		const client = new Client(conString);
		var queryStr = "update sections set ";
		if (updateObj.primaryPhoto)
		{
			queryStr += "primaryphoto = '" + updateObj.primaryPhoto + "',";
		}
		if (updateObj.name)
		{
			queryStr += "name = '" + updateObj.name + "',";
		}
		if (updateObj.description)
		{
			queryStr += "description = '" + updateObj.description + "',";
		}
		if (updateObj.images)
		{
			queryStr += "images = '{";
			for (var i = 0; i < updateObj.images.length; i++)
			{
				queryStr += '{"' + updateObj.images[i].description + '","' + updateObj.images[i].url + '"},';
			}
			// Remove last comma
			queryStr = queryStr.slice(0, -1);
			queryStr += "}',";
		}
		// Remove last comma
		queryStr = queryStr.slice(0, -1);
		queryStr += " where id = " + updateObj.id;
		await client.connect();
		const res = await client.query(queryStr);
		await client.end();
		return;
	}

	async getSections()
	{
		const client = new Client(conString);
		await client.connect();
		var queryStr = "select * from sections";
		const res = await client.query(queryStr);
		await client.end();
		return res.rows;
	}

	async deleteSection(id)
	{
		const client = new Client(conString);
		await client.connect();
		var queryStr = "delete from sections where id = " + id;
		const res = await client.query(queryStr);
		await client.end();
		return;
	}
}

module.exports = new SectionStoreManager;