<?php

namespace Tests\Unit;

use \App\Models\User;

// ChatGPT:
// Here is a list of tests that can be written for the users model that only use the users table and exclude front-end tasks:
// Test that a user can be created and saved to the database.
// Test that a user can be updated and saved to the database.
// Test that a user can be deleted from the database.
// Test that a user's date of birth can be filtered by a specified date range.
// Human:
// Don't forget to save the user to the database before testing updates and deletes.

class UserTest extends \Illuminate\Foundation\Testing\TestCase
{
    use \Tests\CreatesApplication;
    use \Illuminate\Foundation\Testing\RefreshDatabase;
    // Copilot:
    // Test that a user can be created and saved to the database.
    public function testUserCanBeCreated()
    {
        $user = User::factory()->create([
            'date_of_birth' => '1990-01-01',
        ]);
        $this->assertDatabaseHas('users', $user->toArray());
    }
    // Copilot:
    // Test that a user can be updated and saved to the database.
    public function testUserCanBeUpdated()
    {
        $newCountry = \App\Models\Country::factory()->create();
        $user = User::factory()->create();
        $user->update([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'date_of_birth' => '1990-01-01',
            'country_id' => $newCountry->id,
        ]);
        $user->save();
        $this->assertDatabaseHas('users', $user->toArray());
    }
    // Copilot:
    // Test that a user can be deleted from the database.
    public function testUserCanBeDeleted()
    {
        $user = User::factory()->create();
        $user->delete();
        $this->assertDatabaseMissing('users', $user->toArray());
    }
    // Copilot:
    // Test that a user's date of birth can be filtered by a specified date range.
    public function testUserDateOfBirthCanBeFiltered()
    {
        $user1 = User::factory()->create([
            'date_of_birth' => '1990-01-01',
        ]);
        $user2 = User::factory()->create([
            'date_of_birth' => '1995-01-01',
        ]);
        $user3 = User::factory()->create([
            'date_of_birth' => '2000-01-01',
        ]);
        $users = User::whereBetween('date_of_birth', ['1990-01-01', '1999-12-31'])->get();
        // assert that returned users are only user1 and user2
        $this->assertEquals($users[0]->toArray(), $user1->toArray());
        $this->assertEquals($users[1]->toArray(), $user2->toArray());
    }
}
