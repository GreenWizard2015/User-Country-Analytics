<?php

use Illuminate\Support\Facades\Route;
Route::middleware(['errors_as_json'])->group(function () {
    // GET /users - This endpoint is used to retrieve a list of all users from the database.
  Route::get('/users', 'UserController@index');
  
  // POST /users - This endpoint is used to create a new user in the database. The client should send the user information in the request body.
  Route::post('/users', 'UserController@store');
  
  // GET /users/{id} - This endpoint is used to retrieve a specific user from the database. The {id} path parameter should be replaced with the id of the user you want to retrieve.
  Route::get('/users/{id}', 'UserController@show');
  
  // PATCH /users/{id} - This endpoint is used to update a specific user in the database. The {id} path parameter should be replaced with the id of the user you want to update and the client should send the updated information in the request body.
  Route::patch('/users/{id}', 'UserController@update');
  
  // DELETE /users/{id} - This endpoint is used to delete a specific user from the database. The {id} path parameter should be replaced with the id of the user you want to delete.
  Route::delete('/users/{id}', 'UserController@destroy');
  
  // for CountryController
  Route::get('/countries', 'CountryController@all');
});