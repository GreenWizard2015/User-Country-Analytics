<?php

namespace Tests\Unit\Routes;

class CountriesTest extends \Illuminate\Foundation\Testing\TestCase
{
    use \Tests\CreatesApplication;
    use \Illuminate\Foundation\Testing\RefreshDatabase;

    // Route '/api/countries' should return a JSON with all countries and how many users are from each country
    public function testCountriesRoute()
    {
        // Create 3 countries
        $countries = \App\Models\Country::factory()->count(3)->create();
        // Create a users for each country
        foreach ($countries as $country) {
            \App\Models\User::factory()->create([
                'country_id' => $country->id,
            ]);
        }
        // Create another 10 users. Each user will be assigned a random country_id
        \App\Models\User::factory()->count(10)->create(
            function ($user) use ($countries) {
                return [
                    'country_id' => $countries->random()->id,
                ];
            }
        );
        // Get the response from the route
        $response = $this->get('/api/countries');
        // Check that the response is contains the correct data for each country
        foreach ($countries as $country) {
            $usersCount = $country->users()->count();
            $response->assertJsonFragment([
                'id' => $country->id,
                'name' => $country->name,
                'users_count' => $usersCount,
            ]);
        }
    }

    // should ignore a countries with no users
    public function testCountriesRouteIgnoreCountriesWithNoUsers()
    {
        // Create 3 countries
        $countries = \App\Models\Country::factory()->count(3)->create();
        // Create only 1 user and assign it to the first country
        $users = \App\Models\User::factory()->count(1)->create(
            function ($user) use ($countries) {
                return [
                    'country_id' => $countries->first()->id,
                ];
            }
        );

        // Get the response from the route
        $response = $this->get('/api/countries');
        // Check that the response is contains only the first country
        $response->assertJson([[
            'id' => $countries->first()->id,
            'name' => $countries->first()->name,
            'users_count' => 1,
        ]]);
    }
}
