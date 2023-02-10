<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            // date of birth is a date between 18 and 65 years ago as a unix timestamp rounded to the day
            'date_of_birth' => $this->faker->dateTimeBetween('-65 years', '-18 years')->format('Y-m-d'),
            // country_id is referenced to the countries table
            'country_id' => function () {
                return \App\Models\Country::factory()->create()->id;
            },
        ];
    }
}
