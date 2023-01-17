<?php

namespace Tests\Unit\DB;

use App\Models\Country;

class CountriesTest extends \Illuminate\Foundation\Testing\TestCase
{
    use \Tests\CreatesApplication;
    use \Illuminate\Foundation\Testing\RefreshDatabase;
    use \Illuminate\Foundation\Testing\WithFaker;

    public function testCountryCanBeCreated()
    {
        $name = $this->faker->word;
        $country = Country::factory()->make(['name' => $name]);
        $this->assertTrue($country->save());
        $this->assertDatabaseHas('countries', ['name' => $name]);
    }

    public function testCountryCanBeUpdated()
    {
        $country = Country::factory()->create();
        $newName = $this->faker->word;
        $country->name = $newName;
        $this->assertTrue($country->save());
        $this->assertDatabaseHas('countries', ['name' => $newName]);
    }
    public function testCountryCanBeDeleted()
    {
        $country = Country::factory()->create();
        $this->assertTrue($country->delete());
        $this->assertDatabaseMissing('countries', ['id' => $country->id]);
    }

    // test users method
    public function testUsersMethod()
    {
        $country = Country::factory()->create();
        $users = \App\Models\User::factory()->count(10)->create(['country_id' => $country->id]);
        $this->assertEquals($users->count(), $country->users()->count());
    }
}
