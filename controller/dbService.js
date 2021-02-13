const connection = require('../config/database-config');


module.exports = {

    // insert data ( fav0rite item)
    createFavorite: async (data) => {

        try {
            const movieId = parseInt(data.movieId);
            const userId = parseInt(data.userId);
            // check if movie is already exsists in wish list
            const isEntry = await checkWishListEntry(userId, movieId);
            if (!isEntry) {
                // check movie list for entry 
                const isMovie = await chcekMovieListEntry(movieId)
                if (!isMovie) {
                    const affectedRows = await insertMovie(data);
                    if (affectedRows === 1) {
                        await insertWishList(userId, movieId);
                    }
                    return true;
                }
                else {
                    //insert into wish_list
                    await insertWishList(userId, movieId);
                    return true;
                }
            }
            else {
                return false;
            }
        }

        catch (error) {
            console.log(error)
            return false;
        }

    },

    // get all data(favorite items)
    getFavorites: async (userId) => {
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
            return false;
        }

    },

    // delete favorite movie
    deleteFavorite: async (movieId, userId) => {

        try {
            const status = await deleteWishListEntry(movieId, userId)
            if (status) {
                const isEntry = await movieInWishList(movieId)
                if (!isEntry) {
                    const status = await deleteMovie(movieId);
                    if (status) {
                        return true;
                    } else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
        }

        catch (error) {
            console.log(error)
            return false;
        }

    },

    // crete user in db
    createUser: async (user) => {

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

    },

    //get user by email
    getUserByEmail: async (email) => {

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
            console.log(error);
            return false;
        }

    },

    //get user by id
    getUserById: async (id) => {

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
            return false;
        }

    }
}


//Functions

// check wish list for entry
const checkWishListEntry = async (userId, movieId) => {
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
        console.log(err)
        return false;
    }
}

// check movie_list  for movie
const chcekMovieListEntry = async (movieId) => {
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

// insert into movie list
const insertMovie = async (data) => {
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
const insertWishList = async (userId, movieId) => {
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

// check for other entry of the movie in wish list
const movieInWishList = async (movieId) => {

    try {
        const isEntry = await new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM wish_list WHERE movie_id = (?)';
            connection.query(sql, [movieId], (error, result) => {
                if (error) reject(new Error(error.message));
                resolve(result);
            })
        })
        if (isEntry.length === 0) {
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
const deleteWishListEntry = async (movieId, userId) => {

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
        return false;
    }

}

// delete movie from movie_list
const deleteMovie = async (movieId) => {
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
        return false;
    }

}

