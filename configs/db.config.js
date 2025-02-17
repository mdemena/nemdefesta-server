const mongoose = require('mongoose');

mongoose
	.connect(process.env.MONGO_URL, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((x) =>
		console.log(
			`Connected to MongoDB! Database name: "${x.connections[0].name}"`
		)
	)
	.catch((err) => console.error('Error connecting to mongo', err));
