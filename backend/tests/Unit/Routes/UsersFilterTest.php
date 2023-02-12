<?php

namespace Tests\Unit\Routes;

class UsersFilterTest extends \Illuminate\Foundation\Testing\TestCase
{
    use \Tests\CreatesApplication;
    use \Illuminate\Foundation\Testing\RefreshDatabase;

    // return zero users and totalPages
    public function testNoUsers()
    {
        $response = $this->get('/api/users');
        $response->assertHeader('Content-Type', 'application/json');
        $response->assertJson([
            'users' => [],
            'totalPages' => 0,
        ]);
    }

    // Route '/api/users?country=&dateFrom=&dateTo=' should return a JSON with the filtered users
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
        $response = $this->get('/api/users?country=' . $countries[1]->id);
        // Check that the response is a JSON
        $response->assertHeader('Content-Type', 'application/json');
        // Check that the response is contains the correct data for the filtered user
        $response->assertJsonFragment([
            'id' => $user->id,
        ]);

        // Check when filtering by date_of_birth
        $dateTimestamp = date_create_from_format('Y-m-d', '1990-01-01')->getTimestamp();
        $this->get('/api/users?dateFrom=' . $dateTimestamp)
            ->assertJsonFragment([
                'id' => $user->id,
            ]);
        $this->get('/api/users?dateTo=' . $dateTimestamp)
            ->assertJsonFragment([
                'id' => $user->id,
            ]);
        $this->get('/api/users?dateFrom=' . $dateTimestamp . '&dateTo=' . $dateTimestamp)
            ->assertJsonFragment([
                'id' => $user->id,
            ]);

        // check inverse behavior
        $dateTimestamp = date_create_from_format('Y-m-d', '1990-01-02')->getTimestamp();
        $this->get('/api/users?dateFrom=' . $dateTimestamp)
            ->assertJsonFragment([
                'users' => [],
            ]);
    }

    // This test should send a GET request to the /users?country=&dateFrom=&dateTo= endpoint with invalid or missing parameters and check if the response contains the appropriate error message or status code.
    public function testFilterUsersWithInvalidParameters()
    {
        // Create a country
        $country = \App\Models\Country::factory()->create();

        // Get and check the response when the country parameter is invalid
        $this->get('/api/users?country=invalid&dateFrom=1&dateTo=0')
            ->assertJsonFragment([
                'message' => 'The given data was invalid.',
            ]);
        // Get and check the response when the from parameter is after the to parameter
        $this->get('/api/users?country=' . $country->id . '&dateTo=1980-01-01&dateFrom=1990-01-01')
            ->assertJsonFragment([
                'message' => 'The given data was invalid.',
            ]);
        // Get and check the response when the to parameter is before the from parameter
        $this->get('/api/users?country=' . $country->id . '&dateFrom=1990-01-01&dateTo=1980-01-01')
            ->assertJsonFragment([
                'message' => 'The given data was invalid.',
            ]);
    }

    private function _setupUsers()
    {
        // Create dummy users
        $country = \App\Models\Country::factory()->create([
            'name' => 'Not USA',
        ]);
        // Create a bad users with the country and date_of_birth that we want to filter
        \App\Models\User::factory()->count(30)->create([
            'country_id' => $country->id,
            'date_of_birth' => '1980-01-01',
        ]);
        // same for the date_of_birth beyond the range
        \App\Models\User::factory()->count(30)->create([
            'country_id' => $country->id,
            'date_of_birth' => '2000-01-01',
        ]);
        // Create a good users with the country and date_of_birth that we want to filter
        $country = \App\Models\Country::factory()->create([
            'name' => 'USA',
        ]);
        $users = \App\Models\User::factory()->count(30)->create([
            'country_id' => $country->id,
            'date_of_birth' => '1990-01-01',
        ]);
        $query = [
            'country' => $country->id,
            'dateFrom' => date_create_from_format('Y-m-d', '1990-01-01')->getTimestamp(),
            'dateTo' => date_create_from_format('Y-m-d', '1990-01-01')->getTimestamp(),
            'page' => 1,
            'perPage' => 100000,
        ];

        // convert the users to array with the correct format
        $users = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'country_id' => $user->country_id,
                'country_name' => $user->country->name,
                'date_of_birth' => $user->date_of_birth->timestamp,
            ];
        })->toArray();
        return [$country, $users, $query];
    }

    // should return a JSON with the filtered users with the default parameters
    public function testGetUsersWithDefaultParameters()
    {
        list($country, $users, $query) = $this->_setupUsers();
        // Check that the response is contains the correct data for the filtered user
        $this->get('/api/users?' . http_build_query($query))
            ->assertJson([
                'users' => $users,
                'totalPages' => 1,
            ]);
    }

    // should include the country_name in the response for each user
    public function testGetUsersWithCountryName()
    {
        list($country, $users, $query) = $this->_setupUsers();
        // Check that the response is contains the correct data for the filtered user
        $this->get('/api/users?' . http_build_query($query))
            ->assertJsonFragment([
                'country_name' => $country->name,
            ]);
    }

    public function perPageProvider()
    {
        return [[5], [7], [13], [23],];
    }
    /**
     * @dataProvider perPageProvider
     */
    public function testGetUsersAllPagesValid($perPage)
    {
        list($country, $users, $query) = $this->_setupUsers();
        $query['perPage'] = $perPage;
        $totalPages = ceil(count($users) / $perPage);
        for ($i = 1; $i <= $totalPages; $i++) {
            // Send the GET request with the current page
            $query['page'] = $i;
            $response = $this->get('/api/users?' . http_build_query($query));
            // take the expected users for the current page
            $expectedUsers = array_slice($users, ($i - 1) * $perPage, $perPage);
            $response->assertJson([
                'users' => $expectedUsers,
                'totalPages' => (int)$totalPages,
            ]);
        }
    }

    // test that didn't hit into N+1 problem with the country relation
    public function testGetUsersAllPagesNPlus1()
    {
        list($country, $users, $query) = $this->_setupUsers();
        // Enable the query log
        \DB::connection()->enableQueryLog();

        // get all users
        $query['perPage'] = count($users);
        $query['page'] = 1;
        $this->get('/api/users?' . http_build_query($query));

        // Disable the query log and get the queries
        \DB::connection()->disableQueryLog();
        $queries = \DB::getQueryLog();
        // Check that the number of queries is less than the number of users
        $this->assertLessThan(count($users), count($queries));
    }
}
