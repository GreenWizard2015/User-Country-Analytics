<?php

namespace Tests\Unit;

use Carbon\Carbon;

// Here we are testing only the public api of the app, without the access to the database, models, etc.
class AppTest extends \Illuminate\Foundation\Testing\TestCase
{
    use \Tests\CreatesApplication;
    use \Illuminate\Foundation\Testing\RefreshDatabase;

    public function testUpdateCountriesStatsWhenUserUpdate()
    {
        // Create 2 users with same country by using the POST /api/users requests
        $userID = $this->post('/api/users', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'country_name' => 'USA',
            'date_of_birth' => Carbon::now()->subYears(30)->timestamp,
        ])->json('id');
        $this->post('/api/users', [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'country_name' => 'USA',
            'date_of_birth' => Carbon::now()->subYears(30)->timestamp,
        ])->json();

        // change the country of the first user
        $this->patch('/api/users/' . $userID, [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'country_name' => 'Canada',
            'date_of_birth' => Carbon::now()->subYears(30)->timestamp,
        ]);

        // check that the country stats are updated
        $stats = $this->get('/api/countries');
        // should return 2 countries
        $stats->assertJsonCount(2);
        // should return 1 user for the first country
        $stats->assertJsonFragment([
            'name' => 'Canada',
            'users_count' => 1,
        ]);
        // should return 1 user for the second country
        $stats->assertJsonFragment([
            'name' => 'USA',
            'users_count' => 1,
        ]);
    }

    public function testNoCountryWithoutUsers()
    {
        // Create a user by using the POST /api/users request
        $userID = $this->post('/api/users', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'country_name' => 'USA',
            'date_of_birth' => Carbon::now()->subYears(30)->timestamp,
        ])->json('id');
        // Change the country of the user
        $this->patch('/api/users/' . $userID, [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'country_name' => 'Canada',
            'date_of_birth' => Carbon::now()->subYears(30)->timestamp,
        ]);
        // get the country stats
        $stats = $this->get('/api/countries');
        // should return only 1 country
        $stats->assertJsonCount(1);
        $stats->assertJsonFragment([
            'name' => 'Canada',
            'users_count' => 1,
        ]);
    }
}
