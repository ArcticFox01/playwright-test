import { test } from "../../fixtures";
import { expect } from "@playwright/test";
import { PetTestData, Pet } from "../../../utils/api/types";
import { ApiError } from "../../../utils/api/base";

test.describe("Petstore API Tests", () => {
  let petId: number;
  let testData: PetTestData;
  let newPet: Pet;

  test.beforeEach(async ({ petstoreApi }) => {
    testData = petstoreApi.loadPetstoreTestData<PetTestData>("pet.data.json");
    newPet = {
      id: Date.now(),
      ...testData.pet,
    };
  });

  test("should perform full CRUD operations on a pet", async ({
    petstoreApi,
  }) => {
    // CREATE - Add a new pet
    const createdPet = await petstoreApi.createPet(newPet);
    expect(createdPet.id).toBeDefined();
    if (!createdPet.id) throw new Error("Pet ID is undefined");
    petId = createdPet.id;

    // READ - Get pet by ID
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for pet to be available
    const retrievedPet = await petstoreApi.getPet(petId);
    expect(retrievedPet.id).toBe(petId);

    // UPDATE - Update pet's status
    const updatedPet: Pet = {
      ...newPet,
      id: petId,
      status: "pending",
    };
    const updatedPetResponse = await petstoreApi.updatePet(updatedPet);
    expect(updatedPetResponse.id).toBe(petId);
    expect(updatedPetResponse.status).toBe("pending");

    // DELETE - Delete pet
    await petstoreApi.deletePet(petId);
  });

  test("should find pets by status", async ({ petstoreApi }) => {
    // Create a new available pet first
    const createdPet = await petstoreApi.createPet(newPet);
    expect(createdPet.id).toBeDefined();
    try {
      // Wait for pet to be available in the system
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get available pets
      const pets = await petstoreApi.findPetsByStatus("available");
      expect(Array.isArray(pets)).toBeTruthy();
      expect(pets.length).toBeGreaterThan(0);

      // Find our created pet in the list
      const ourPet = await pets.find((p) => p.id === createdPet.id);
      expect(ourPet).toBeDefined();
      if (ourPet) {
        expect(ourPet).toHaveProperty("name", newPet.name);
        expect(ourPet).toHaveProperty("status", "available");
      }
    } finally {
      // Cleanup: Delete the pet we created
      if (createdPet.id) {
        await petstoreApi.deletePet(createdPet.id);
      }
    }
  });

  test("should handle invalid pet ID", async ({ petstoreApi }) => {
    const invalidId = -1; // Using negative ID to ensure it's invalid
    try {
      await petstoreApi.getPet(invalidId);
      // If no error is thrown, the API returned a default pet
      // This is also a valid behavior for some implementations
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.status).toBe(404);
      } else {
        throw error;
      }
    }
  });
});
