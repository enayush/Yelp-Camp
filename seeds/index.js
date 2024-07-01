const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedsHelper');
const Campground = require('../models/campgrounds');

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
    .then(console.log('connected'))
    .catch(error => handleError(error));

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor((Math.random() * 30) + 20);
        const camp = new Campground({
            author :'6609360888a44bc9e4597c8e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:[
                {
                  url: 'https://res.cloudinary.com/dbe5zolpo/image/upload/v1712004270/YelpCamp/apqdbqktm3wwfwrsux9k.jpg',
                  filename: 'YelpCamp/apqdbqktm3wwfwrsux9k',
                }
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea reiciendis libero doloremque quod amet incidunt iure minus? Laudantium sapiente adipisci at magni voluptatum sunt perferendis rerum dolor? Placeat, explicabo in',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})