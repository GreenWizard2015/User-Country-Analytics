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
        // Create a users table with 10 users. Each user will be assigned a random country_id
        $users = \App\Models\User::factory()->count(10)->create(
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
            $response->assertJsonFragment([
                'id' => $country->id,
                'name' => $country->name,
                'users_count' => $users->where('country_id', $country->id)->count(),
            ]);
        }
    }
}
