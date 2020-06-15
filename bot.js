const axios = require('axios');
const CronJob = require('cron').CronJob;
const Twit = require('twit');

const config = require('./config');
const T = new Twit(config);

const postTweet = () => {
	// make a request to the API
	axios
		.get('https://corona.lmao.ninja/v2/countries/Philippines')
		.then((response) => {
			// handle success

			const {
				updated,
				cases,
				deaths,
				recovered,
				active,
				critical,
				tests,
			} = response.data;

			const date = new Date(updated);
			const dateOptions = {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				timeZone: 'Asia/Manila',
			};

			// format date
			const formatDate = (date) => {
				return date.toLocaleString('en-US', dateOptions);
			};

			// add commas
			const formatNum = (num) => {
				return num.toLocaleString();
			};

			// tweet template
			const tweetContent = `Update as of ${formatDate(
				date
			)}\n\n\nConfirmed ― ${formatNum(cases)}\nRecovered ― ${formatNum(
				recovered
			)}\nDeceased ― ${formatNum(deaths)}\n\n\nActive Cases ― ${formatNum(
				active
			)}\nCritical ― ${formatNum(critical)}\nTests Conducted ― ${formatNum(
				tests
			)}`;

			// post tweet
			T.post(
				'statuses/update', {
					// tweet content
					status: tweetContent,
				}, (err, data, response) => {
					console.log(data);
				}
			);
		})
		.catch((err) => {
			// handle error
			console.log(err);
		});
};

// cron job
const postTweetJob = new CronJob(
	// time to fire off the job
	'0 */12 * * *',
	// function to fire
	postTweet,
	// timezone
	'Asia/Manila'
);
// run cron
postTweetJob.start();
