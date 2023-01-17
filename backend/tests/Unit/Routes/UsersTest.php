<?php

namespace Tests\Unit\Routes;

/*
ChatGPT:

testRetrieveAllUsers(): This test should send a GET request to the /users endpoint and check if the response contains a list of all users in the database. This test should be run after setting up some test data in the users table.

testCreateUser(): This test should send a POST request to the /users endpoint with the necessary information for a new user and check if the response contains the newly created user and if the user is added to the database. This test should be run after clearing the users table and setting up any necessary test data for the country table.

testRetrieveUser(): This test should send a GET request to the /users/{id} endpoint with a valid user id and check if the response contains the correct user. This test should be run after setting up some test data in the users table.

testUpdateUser(): This test should send a PATCH request to the /users/{id} endpoint with a valid user id and updated information and check if the response contains the updated user and if the user is updated in the database. This test should be run after setting up some test data in the users table.

testDeleteUser(): This test should send a DELETE request to the /users/{id} endpoint with a valid user id and check if the response is successful and if the user is deleted from the database. This test should be run after setting up some test data in the users table.

testFilterUsers(): This test should send a GET request to the /users/filter?country=&from=&to= endpoint with valid parameters for country and date_of_birth range and check if the response contains the filtered users. This test should be run after setting up some test data in the users and countries table.

testInvalidFilterParameters(): This test should send a GET request to the /users/filter?country=&from=&to= endpoint with invalid or missing parameters and check if the response contains the appropriate error message or status code.

testInvalidUpdateDeleteParameters(): This test should send a PATCH or DELETE request to the /users/{id} endpoint with invalid or missing parameters and check if the response contains the appropriate error message or status code.

testInvalidCreateParameters(): This test should send a POST request to the /users endpoint with invalid or missing parameters and check if the response contains the appropriate error message or status code.
*/

class UsersTest extends \Illuminate\Foundation\Testing\TestCase
{
    use \Tests\CreatesApplication;
    use \Illuminate\Foundation\Testing\RefreshDatabase;

    // Route '/api/users' should return a JSON with all users
    public function testRetrieveAllUsers()
    {
        // Create 3 users
        $users = \App\Models\User::factory()->count(3)->create();
        // Get the response from the route
        $response = $this->get('/api/users');
        // Check that the response is a JSON
        $response->assertHeader('Content-Type', 'application/json');
        // Check that the response is contains the correct data for each user
        foreach ($users as $user) {
            $response->assertJsonFragment([
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'country_id' => $user->country_id,
                'date_of_birth' => $user->date_of_birth->format('Y-m-d'),
            ]);
        }
    }

    // Route '/api/users' should create a new user and return a JSON with the new user
    public function testCreateUser()
    {
        // Create a country
        $country = \App\Models\Country::factory()->create();
        // Get the response from the route
        $response = $this->post('/api/users', [
            'first_name' => 'Test',
            'last_name' => 'User',
            'country_id' => $country->id,
            'date_of_birth' => '1990-01-01',
        ]);
        // Check that the response is a JSON
        $response->assertHeader('Content-Type', 'application/json');
        // Check that the response is contains the correct data for the new user
        $response->assertJsonFragment([
            'first_name' => 'Test',
            'last_name' => 'User',
            'country_id' => $country->id,
            'date_of_birth' => '1990-01-01',
        ]);
        // Check that the new user is in the database
        $this->assertDatabaseHas('users', [
            'first_name' => 'Test',
            'last_name' => 'User',
            'country_id' => $country->id,
            'date_of_birth' => '1990-01-01',
        ]);
    }

    // Route '/api/users/{id}' should return a JSON with the user
    public function testRetrieveUser()
    {
        // Create a user
        $user = \App\Models\User::factory()->create();
        // Get the response from the route
        $response = $this->get('/api/users/' . $user->id);
        // Check that the response is a JSON
        $response->assertHeader('Content-Type', 'application/json');
        // Check that the response is contains the correct data for the user
        $response->assertJsonFragment([
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'country_id' => $user->country_id,
            'date_of_birth' => $user->date_of_birth->format('Y-m-d'),
        ]);
    }

    // Route '/api/users/{id}' should update the user and return a JSON with the updated user
    public function testUpdateUser()
    {
        // Create a user
        $user = \App\Models\User::factory()->create();
        $newCountry = \App\Models\Country::factory()->create();
        // Get the response from the route
        $response = $this->patch('/api/users/' . $user->id, [
            'first_name' => 'Updated User',
            'last_name' => 'User',
            'country_id' => $newCountry->id,
            'date_of_birth' => '1990-01-01',
        ]);
        // Check that the response is a JSON
        $response->assertHeader('Content-Type', 'application/json');
        // Check that the response is contains the correct data for the updated user
        $response->assertJsonFragment([
            'id' => $user->id,
            'first_name' => 'Updated User',
            'last_name' => 'User',
            'country_id' => $newCountry->id,
            'date_of_birth' => '1990-01-01',
        ]);
        // Check that the user is updated in the database
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'first_name' => 'Updated User',
            'last_name' => 'User',
            'country_id' => $newCountry->id,
            'date_of_birth' => '1990-01-01',
        ]);
    }

    // Route '/api/users/{id}' should delete the user and return a successful response
    public function testDeleteUser()
    {
        // Create a user
        $user = \App\Models\User::factory()->create();
        // Get the response from the route
        $response = $this->delete('/api/users/' . $user->id);
        // Check that the response is successful
        $response->assertStatus(204); // 204 No Content
        // Check that the user is deleted from the database
        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    // Route '/api/users/filter?country=&from=&to=' should return a JSON with the filtered users
    public function testFilterUsers()
    {
        // Create a 2 countries
        $countries = \App\Models\Country::factory()->count(2)->create();
        // Create 3 users and assign them to the first country
        $users = \App\Models\User::factory()->count(3)->create([
            'country_id' => $countries[0]->id,
            'date_of_birth' => '1980-01-01',
        ]);
        // Create a user with the country and date_of_birth that we want to filter
        $user = \App\Models\User::factory()->create([
            'country_id' => $countries[1]->id,
            'date_of_birth' => '1990-01-01',
        ]);
        // Get the response from the route
        $response = $this->get('/api/users/filter?country=' . $countries[1]->id);
        // Check that the response is a JSON
        $response->assertHeader('Content-Type', 'application/json');
        // Check that the response is contains the correct data for the filtered user
        $response->assertJsonFragment([
            'id' => $user->id,
        ]);

        // Check when filtering by date_of_birth
        $this->get('/api/users/filter?from=1990-01-01&to=1990-01-01')
            ->assertJsonFragment([
                'id' => $user->id,
            ]);
    }

    // This test should send a GET request to the /users/filter?country=&from=&to= endpoint with invalid or missing parameters and check if the response contains the appropriate error message or status code.
    public function testFilterUsersWithInvalidParameters()
    {
        // Create a country
        $country = \App\Models\Country::factory()->create();

        // Get and check the response when the country parameter is invalid
        $this->get('/api/users/filter?country=invalid&from=1980-01-01&to=1990-01-01')
            ->assertJsonFragment([
                'message' => 'The given data was invalid.',
            ]);
        // Get and check the response when the from parameter is after the to parameter
        $this->get('/api/users/filter?country=' . $country->id . '&to=1980-01-01&from=1990-01-01')
            ->assertJsonFragment([
                'message' => 'The given data was invalid.',
            ]);
        // Get and check the response when the to parameter is before the from parameter
        $this->get('/api/users/filter?country=' . $country->id . '&from=1990-01-01&to=1980-01-01')
            ->assertJsonFragment([
                'message' => 'The given data was invalid.',
            ]);
    }

    // testInvalidUpdateParameters(): This test should send a PATCH request to the /users/{id} endpoint with invalid or missing parameters and check if the response contains the appropriate error message or status code.
    function testInvalidUpdateParameters()
    {
        // Create a user
        $user = \App\Models\User::factory()->create();
        // Get the response from the route
        $response = $this->patch('/api/users/' . $user->id, [
            'first_name' => 'Updated User',
            'last_name' => 'User',
            'country_id' => $user->country_id,
            'date_of_birth' => '19-1',
        ]);
        // Check that the response is contains the appropriate error message or status code
        $response->assertJsonFragment([
            'message' => 'The given data was invalid.',
        ]);
    }

    // testInvalidCreateParameters(): This test should send a POST request to the /users endpoint with invalid or missing parameters and check if the response contains the appropriate error message or status code.
    function testInvalidCreateParameters()
    {
        // Create a user
        $user = \App\Models\User::factory()->create();
        // Get the response from the route
        $response = $this->post('/api/users', [
            'name' => '',
            'country_id' => -7,
            'date_of_birth' => '1990',
        ]);
        // Check that the response is a JSON
        $response->assertHeader('Content-Type', 'application/json');
        // Check that the response is contains the appropriate error message or status code
        $response->assertJsonFragment([
            'message' => 'The given data was invalid.',
        ]);
    }
}
