const mysql = require('mysql');
const { resolve } = require('path');


// creaet connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: 'movies',

})

// connec to db
connection.connect(err => {
    if (err) console.log('error while Connecting db', err);
    console.log('Mysql connected')
})

// insert data ( fav0rite item)
async function createFavorite(data) {
    try {
        const movieId = parseInt(data.movieId);
        const userId = parseInt(data.userId);
        //check wish list for entry
        const result = checkWishListEntry(userId, movieId);
        result
            .then(isEntry => {
                // no entry
                if (!isEntry) {
                    // check movie list for entry 
                    const result = chcekMovieListEntry(movieId)
                    result
                        .then(isMovie => {
                            // movie not exists in movie_list
                            if (!isMovie) {
                                //insert movie 
                                const result = insertMovie(data);
                                result
                                    .then(res => {
                                        // insert into wish_list
                                        if (res === 1) {
                                            const result = insertWishList(userId, movieId);
                                        }
                                    })

                            }
                            else {
                                //insert into wish_list
                                const result = insertWishList(userId, movieId);
                            }
                        })

                }
                //entry exists
                else {
                    return;
                    // do nothing 
                }
            })

    }
    catch (error) {
        console.log(error)
    }
}

// check movie_list  for movie
async function chcekMovieListEntry(movieId) {
    try {
        const movie = await new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM movie_list WHERE movie_id = (?)';
            connection.query(sql, [movieId], (error, results) => {
                if (error) reject(new Error(error.message))
                resolve(results)
            })
        })
        // movie not exsists
        if (movie.length === 0) {
            return false
        }
        else {
            // movie exists
            return true;
        }
    }
    catch (err) {
        console.log(err)
    }
}

// check wish list for entry
async function checkWishListEntry(userId, movieId) {
    try {
        const isEntry = await new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM wish_list WHERE user_id = (?) AND movie_id = (?)';
            connection.query(sql, [userId, movieId], (error, result) => {
                if (error) reject(new Error(error.message));
                resolve(result);
            })
        })
        if (isEntry.length === 0) {
            // no entry with userid and movieid
            return false;
        } else {
            return true;
        }
    }
    catch (err) {
        if (err) console.log(err)
    }
}


// insert into movie list
async function insertMovie(data) {
    try {
        const movieId = parseInt(data.movieId);
        const year = parseInt(data.year);
        const affectedRows = await new Promise((resolve, reject) => {
            const sql = 'INSERT INTO movie_list(movie_id, title, year, image) VALUES( ?, ?, ?, ?)';
            connection.query(sql, [movieId, data.title, year, data.imagePath], (error, result) => {
                if (error) {
                    // return if duplicate entry error
                    if (error.code === 'ER_DUP_ENTRY') {
                        return;
                    }
                    reject(new Error(error.message));
                }
                else {
                    resolve(result.affectedRows);
                }
            })
        })
        return affectedRows;

    }
    catch (err) {
        if (err) console.log(err)
    }
}

//insert into wish list
async function insertWishList(userId, movieId) {
    try {
        const affectedRows = await new Promise((resolve, reject) => {
            const sql = 'INSERT INTO wish_list(user_id, movie_id) VALUES( ?, ?)';
            connection.query(sql, [userId, movieId], (error, result) => {
                if (error) {
                    // return if duplicate entry error
                    if (error.code === 'ER_DUP_ENTRY') {
                        return;
                    }
                    reject(new Error(error.message));
                }
                else {
                    resolve(result.affectedRows);
                }
            })
        })
        return affectedRows;
    }
    catch (err) {
        if (err) console.log(err)
    }
}








// get all data(favorite items)
async function getFavorites(userId) {
    try {
        const favorites = await new Promise((resolve, reject) => {
            const sql =
                `SELECT movie_list.movie_id, movie_list.title, movie_list.year, movie_list.image FROM movie_list 
            JOIN wish_list ON movie_list.movie_id = wish_list.movie_id 
            JOIN users ON wish_list.user_id = users.id WHERE users.id = (?)`;
            connection.query(sql, [userId], (error, results) => {
                if (error) reject(new Error(error.message))
                resolve(results)
            })

        })
        return favorites;
    }
    catch (error) {
        console.log(error)
    }

}

// delete favorite movie
async function deleteFavorite(movieId, userId) {
    try {
        const status = await new Promise((resolve, reject) => {
            const result = deleteEntryWishList(movieId, userId)
            result
                .then(status => {
                    if (status) {
                        // check for other entry of the movie in wish list
                        const result = movieInWishList(movieId)
                        result
                            .then(isEntry => {
                                // no other entry for that movie
                                if (!isEntry) {
                                    // delete movie from movie_list
                                    const result = deleteMovie(movieId);
                                    result
                                        .then(status => resolve(status))
                                }
                                else {
                                    resolve(true)
                                    // console.log('entry exists with the movie')
                                }
                            })
                    }
                })
                .catch(err => {
                    reject(new Error(err.message))
                })

        })
        return status;
    }
    catch (error) {
        console.log(error)
    }
}

// check for other entry of the movie in wish list
async function movieInWishList(movieId) {
    try {
        const isEntry = await new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM wish_list WHERE movie_id = (?)';
            connection.query(sql, [movieId], (error, result) => {
                if (error) reject(new Error(error.message));
                resolve(result);
            })
        })
        if (isEntry.length === 0) {
            // no other entry with  movieid in wish_list
            return false;
        } else {
            return true;
        }
    }
    catch (error) {
        console.log(error);
    }
}

// delete entry in wish list
async function deleteEntryWishList(movieId, userId) {
    try {
        const affectedRows = await new Promise((resolve, reject) => {
            const sql = 'DELETE FROM wish_list WHERE movie_id = (?) AND user_id = (?)';
            connection.query(sql, [movieId, userId], (error, result) => {
                if (error) reject(new Error(error.message))
                resolve(result.affectedRows)
            })

        })
        return affectedRows ? true : false;
    }
    catch (error) {
        console.log(error)
    }
}


// delete movie from movie_list
async function deleteMovie(movieId) {
    try {
        const affectedRows = await new Promise((resolve, reject) => {
            const sql = ' DELETE FROM  movie_list WHERE movie_id = (?)';
            connection.query(sql, [movieId], (error, result) => {
                if (error) reject(new Error(error.message))
                resolve(result.affectedRows);
            })
        })
        return affectedRows ? true : false;
    }
    catch (error) {
        console.log(error);
    }
}





// User
// crete user in db
async function createUser(user) {
    try {
        const insertId = await new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users(id, name, email, password) VALUES( ?, ?, ?, ?)';
            connection.query(sql, [user.id, user.name, user.email, user.password], (error, result) => {
                if (error) {
                    reject(new Error(error.message));
                }
                else {
                    resolve(result.insertId);
                }
            })
        })
        return insertId;
    }
    catch (error) {
        console.log('e' + error)
        return false;
    }
}

//get user by email
async function getUserByEmail(email) {
    try {
        const user = await new Promise((resolve, reject) => {
            const sql = 'SELECT *  FROM  users WHERE email = (?);';
            connection.query(sql, [email], (err, result) => {
                if (err) {
                    reject(new Error(err.message));
                }
                else {
                    resolve(result[0]);
                }
            })
        })
        return user;
    }
    catch (error) {
        console.log(error)
    }
}

//get user by id
async function getUserById(id) {
    try {
        const user = await new Promise((resolve, reject) => {
            const sql = 'SELECT *  FROM  users WHERE id = (?);';
            connection.query(sql, [id], (err, result) => {
                if (err) {
                    reject(new Error(err.message));
                }
                else {
                    resolve(result[0]);
                }
            })
        })
        return user;
    }
    catch (error) {
        console.log(error)
    }
}



module.exports.createFavorite = createFavorite;
module.exports.getFavorites = getFavorites;
module.exports.deleteFavorite = deleteFavorite;

// user
module.exports.createUser = createUser;
module.exports.getUserByEmail = getUserByEmail;
module.exports.getUserById = getUserById;
