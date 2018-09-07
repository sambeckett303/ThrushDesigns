const { Client } = require('pg');
const conString = process.env.DATABASE_URL;

class BlogStoreManager
{
	async addBlogPost(title)
	{
		const client = new Client(conString);
		await client.connect();
		title = title.replace(/'/g, "''");
		const url = encodeURI(title.replace(/ /g,"_"));
		const queryStr = "insert into blog (published, title, url) values (false, '" + title + "','" + url + "') returning id";
		const res = await client.query(queryStr);
		await client.end();
		return res.rows[0].id;
	}

	async updateBlogPost(updateObj)
	{
		const client = new Client(conString);
		var queryStr = "update blog set ";
		if (updateObj.title)
		{
			var title = updateObj.title.replace(/'/g, "''");
			queryStr += "title = '" + title + "',";
		}
		if (updateObj.content == "empty")
		{
			queryStr += "content = '',";
		}
		else if (updateObj.content)
		{
			var content = updateObj.content.replace(/'/g, "''");
			queryStr += "content = '" + content + "',";
		}
		if (updateObj.publishDate)
		{
			queryStr += "published = true, date_published = '" + updateObj.publishDate + "',";
		}
		queryStr = queryStr.slice(0, -1);
		queryStr += " where id = " + updateObj.id;
		await client.connect();
		const res = await client.query(queryStr);
		await client.end();
		return;
	}

	async deleteBlogPost(blogTitle)
	{
		const client = new Client(conString);
		const queryStr = "delete from blog where title = '" + blogTitle + "'";
		await client.connect();
		const res = await client.query(queryStr);
		await client.end();
		return;
	}

	async getBlogPreviews()
	{
		const client = new Client(conString);
		const queryStr = "select title, url, date_published, content from blog where published = true order by date_published limit 3";
		await client.connect();
		const res = await client.query(queryStr);
		await client.end();
		return res.rows;
	}

	async getBlogTitles()
	{
		const client = new Client(conString);
		const queryStr = "select title, url from blog where published = true order by date_published";
		await client.connect();
		const res = await client.query(queryStr);
		await client.end();
		return res.rows;	
	}

	async getBlog(url)
	{
		const client = new Client(conString);
		const queryStr = "select title, date_published, content from blog where url = '" + url.replace(/'/g, "''") + "'";
		await client.connect();
		const res = await client.query(queryStr);
		await client.end();
		return res.rows;
	}

	async getBlogTitlesAndContent()
	{
		const client = new Client(conString);
		const queryStr = "select id, published, title, content from blog order by date_published";
		await client.connect();
		const res = await client.query(queryStr);
		await client.end();
		return res.rows;
	}
}

module.exports = new BlogStoreManager;