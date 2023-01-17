<?php

namespace App\Http\Controllers;

use App\Models\Country;

class CountryController extends Controller
{
    /**
     * return all countries and how many users are from each country as a JSON
     *
     * @return \Illuminate\Http\Response
     */
    public function all()
    {
        // calculate the number of users from each country by using the Eloquent ORM
        $countries = Country::withCount('users')->get();
        // return the response as a JSON with the HTTP status code 200 and the header Content-Type: application/json
        return response()->json($countries, 200);
    }
}
