import React, { useState, useEffect } from 'react';
import axios from './axios';
import './Row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url = 'https://image.tmdb.org/t/p/original/';

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState('');

    useEffect(() => {
        //API call to external resource will take a second, so we need to run it asynchronously
        //create the async funciton
        async function fetchData() {
            //await will wait until we get a response to continue forward
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }

        fetchData();

        //in useEffect, any variable that is being pulled from the outside HAS to be placed in the array below, because it's now DEPENDENT on that variable
        //if empty list [], run only once when the row loads and never again
        //if list of dependencies like [fetchData], it runs once when row loads and again every time 'fetchData' changes
    }, [fetchUrl]);

    const opts = {
        height: '390',
        width: '100%',

        // automatically play when it loads in
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        // movieTrailer from npm module
        // empty quotes is in case the name is undefined
        movieTrailer(movie?.name || movie?.title || movie?.original_name || '')
            .then((url) => {
                //https://www.youtube.com/watch?v=ABCDEF12345
                //this trick will give us the query parameter to the end, inclusive.
                const urlParams = new URLSearchParams(new URL(url).search);

                //allows us to do a get request on the v param
                const requestedTrailer = urlParams.get('v');
                if (
                    !trailerUrl ||
                    (trailerUrl && trailerUrl != requestedTrailer)
                ) {
                    setTrailerUrl(requestedTrailer);
                } else {
                    setTrailerUrl('');
                }
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row_posters">
                {movies.map((movie) => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row_poster ${
                            isLargeRow && 'row_posterLarge'
                        }`}
                        src={`${base_url}${
                            isLargeRow ? movie.poster_path : movie.backdrop_path
                        }`}
                        alt={movie.name}
                    ></img>
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

export default Row;
