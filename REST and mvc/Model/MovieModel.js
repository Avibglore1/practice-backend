const mongoose = require('mongoose');

const schemaRules = {
    title: {
        type: String,
        required: [true, 'title is required']
    },
    description: {
        type: String,
        required: [true, 'description is required']
    },
    releaseYear: {
        type: Number,
        required: [true, 'release Year is required']
    },
    genre: {
        type: String,
        required: [true, 'genre is required'],
        enum: ['Drama', 'Comedy', 'Action', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Animation',
            'Documentary', 'Other'
        ]
    },
    rating: {
        type: Number,
        min: [1, "rating can't be less than 1"],
        max: [5, "rating can't be more than 5"]
    },
    cast: String,
    director: String,
    thumbnail: String,
    trailerLink: String,
    isPremium: {type: Boolean, default: false}
}

const movieSchema = new mongoose.Schema(schemaRules);

const MovieModel = mongoose.model('Movie', movieSchema);

module.exports = MovieModel;