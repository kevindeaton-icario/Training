import { test, expect } from "@playwright/test";

test("Retrieving all Booking Ids", async ({ request }) => {
    const response = await request.get("https://restful-booker.herokuapp.com/booking");
    await expect(response).toBeOK()
});
    