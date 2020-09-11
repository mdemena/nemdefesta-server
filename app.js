require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const passport = require('passport');

const app = express();

require('dayjs/locale/es');
require('./configs/db.config');
require('./configs/passport.config');
require('./configs/session.config')(app);

const app_name = require('./package.json').name;
const debug = require('debug')(
	`${app_name}:${path.basename(__filename).split('.')[0]}`
);

// Middleware Setup
app.use(
	cors({
		credentials: true,
		origin: [
			'http://localhost:3000',
			'http://dev.nemdefesta.cat',
			'http://www.nemdefesta.cat',
			'https://www.nemdefesta.cat',
		],
	})
);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
	require('node-sass-middleware')({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		sourceMap: true,
	})
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title =
	'API - Nem De Festa !! - Estigues al dia de les festes majors del teu voltant';

const index = require('./routes/index.routes');
app.use('/', index);

const authRoute = require('./routes/auth.routes');
app.use('/api/auth', authRoute);

const userRoute = require('./routes/user.routes');
app.use('/api/users', userRoute);

const eventRoute = require('./routes/event.routes');
app.use('/api/events', eventRoute);

const locationRoute = require('./routes/location.routes');
app.use('/api/locations', locationRoute);

const activityRoute = require('./routes/activity.routes');
app.use('/api/activities', activityRoute);

const commentRoute = require('./routes/comment.routes');
app.use('/api/comments', commentRoute);

const imageRoute = require('./routes/image.routes');
app.use('/api/images', imageRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	console.log(err);
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send('ERROR EN APP');
});

module.exports = app;
