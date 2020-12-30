import React, { useState, useEffect } from 'react';
import axios from './axios';
import requests from './requests';
import './Banner.css';

function Banner() {
    //set some random movie as the banner
    const [movie, setMovie] = useState([]);

    useEffect(() => {
        async function fetchData() {
            //we want the random banner to choose from the netflix originals
            const request = await axios.get(requests.fetchNetflixOriginals);

            //randomly select a movie from the url and set it to he 'movie' variable
            const movies = request.data.results;
            setMovie(movies[Math.floor(Math.random() * movies.length - 1)]);
        }
        fetchData();
    }, []);

    // truncate the banner movie description and append ellipses
    function truncate(str, n) {
        return str?.length > n ? str.substr(0, n - 1) + '...' : str;
    }

    return (
        <header
            className="banner"
            style={{
                backgroundSize: 'cover',
                backgroundImage: `url(
                    "https://image.tmdb.org/t/p/original/${movie?.backdrop_path}"
                )`,
                backgroundPosition: 'center center',
            }}
        >
            <div className="banner_contents">
                {/* movie data will either contain title, name, or original name. We need to account for this */}
                {/* will check in priority order -> movie, then name, then original_name */}
                <h1 className="banner_title">
                    {movie?.title || movie?.name || movie?.original_name}
                </h1>
                <div className="banner_buttons">
                    <button className="banner_button">Play</button>
                    <button className="banner_button">My List</button>
                </div>
                <h1 className="banner_description">
                    {truncate(movie?.overview, 150)}
                </h1>

                {/* empty div for fade effect */}
            </div>
            <div className="banner--fadeBottom" />
        </header>
    );
}

export default Banner;
