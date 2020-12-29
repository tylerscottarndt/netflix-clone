import React, { useState, useEffect } from 'react';
import axios from './axios';
import './Row.css';

const base_url = 'https://image.tmdb.org/t/p/original/';

function Row({ title, fetchUrl }) {
    //state is the way to write variables in REACT
    //useState sets the 'movies' initial value (to the empty array)
    const [movies, setMovies] = useState([]);

    //now we populate it with something
    //when the Row loads, we want to run this code, which makes an API request to TMD (using the Axios library)
    useEffect(() => {
        //API call to external resource will take a second, so we need to run it asynchronously
        //create the async funciton
        async function fetchData() {
            //await will wait until we get a response to continue forward
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }

        //declare the async function
        fetchData();

        //in useEffect, any variable that is being pulled from the outside HAS to be placed in the array below, because it's now DEPENDENT on that variable
        //if empty list [], run only once when the row loads and never again
        //if list of dependencies like [fetchData], it runs once when row loads and again every time 'fetchData' changes
    }, [fetchUrl]);

    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row_posters">
                {movies.map((movie) => (
                    <img
                        className="row_poster"
                        src={base_url + movie.poster_path}
                        alt={movie.name}
                    ></img>
                ))}
            </div>
        </div>
    );
}

export default Row;
