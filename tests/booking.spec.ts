import { test, expect } from "@playwright/test";

const bookingEndpoint = "https://restful-booker.herokuapp.com/booking";
const authEndpoint = "https://restful-booker.herokuapp.com/auth";

test.describe("Verify the Get Booking Ids endpoint [GET /booking]", () => {
  test("Retrieving all Booking Ids", async ({ request }) => {
    const response = await request.get(bookingEndpoint);
    expect(response.status()).toBe(200);
  });

  test("Retrieving all Bookings for Sally Brown", async ({ request }) => {
    const response = await request.get(`${bookingEndpoint}?firstname=Sally&lastname=Brown`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toBeTruthy();
    responseBody.forEach((element: { bookingid: number }) => {
      expect(element.bookingid).toBeGreaterThan(0);
    });
  });
});

test.describe("Verify the Get Booking endpoint [GET /booking/:id]", () => {
  test("Retrieving an existing Booking by the Booking Id", async ({ request }) => {
    const response = await request.get(`${bookingEndpoint}/2`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.firstname).toBe("Sally");
    expect(responseBody.lastname).toBe("Brown");
    expect(responseBody.totalprice).toBe(897);
    expect(responseBody.depositpaid).toBe(true);
    expect(responseBody.bookingdates.checkin).toBe("2020-05-21");
    expect(responseBody.bookingdates.checkout).toBe("2020-09-27");
    expect(responseBody.additionalneeds).toBe("Breakfast");
  });

  test("Retrieving an existing Booking by the Booking Id (Improved)", async ({ request }) => {
    const expectedBookingData = {
      firstname: "Sally",
      lastname: "Brown",
      totalprice: 897,
      depositpaid: true,
      bookingdates: {
        checkin: "2013-02-23",
        checkout: "2014-10-23",
      },
      additionalneeds: "Breakfast",
    };

    const response = await request.get(`${bookingEndpoint}/2`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toMatchObject(expectedBookingData);
  });
});

test.describe("Verify the Create Booking endpoint [POST /booking]", () => {
  test("Creating a new Booking", async ({ request }) => {
    const newBookingObject = {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01",
      },
      additionalneeds: "Breakfast",
    };

    const response = await request.post(bookingEndpoint, {
      headers: {
        ContentType: "application/json",
        Accept: "application/json",
      },
      data: newBookingObject,
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.booking).toMatchObject(newBookingObject);
    expect(responseBody.bookingid).toBeGreaterThan(0);
  });
});

test.describe("Verify the Update Booking endpoint [PUT /booking/:id]", () => {
  F;
  test("Update an existing Booking with an Authorization Token", async ({ request }) => {
    const updatedBookingObject = {
      firstname: "Luke",
      lastname: "Skywalker",
      totalprice: 205,
      depositpaid: true,
      bookingdates: {
        checkin: "2024-02-23",
        checkout: "2024-02-26",
      },
      additionalneeds: "Extra Towels",
    };

    const response = await request.put(`${bookingEndpoint}/1`, {
      headers: {
        ContentType: "application/json",
        Accept: "application/json",
        Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
      },
      data: updatedBookingObject,
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toMatchObject(updatedBookingObject);
  });

  test("Update an existing Booking with an Authorization Cookie", async ({ request }) => {
    const updatedBookingObject = {
      firstname: "Han",
      lastname: "Solo",
      totalprice: 190,
      depositpaid: true,
      bookingdates: {
        checkin: "2024-02-18",
        checkout: "2024-02-19",
      },
      additionalneeds: "DO NOT DISTURB",
    };
    const token = await getAuthorizationCookie(request);

    const response = await request.put(`${bookingEndpoint}/2`, {
      headers: {
        ContentType: "application/json",
        Accept: "application/json",
        Cookie: `token=${token}`,
      },
      data: updatedBookingObject,
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toMatchObject(updatedBookingObject);
  });
});

test.describe("Verify the Delete Booking endpoint [DELETE /booking/:id]", () => {
  test("Delete an existing Booking with an Authorization token", async ({ request }) => {
    let response = await request.delete(`${bookingEndpoint}/6`, {
      headers: {
        Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
      },
    });
    expect(response.status()).toBe(201);

    response = await request.get(`${bookingEndpoint}/6`);
    expect(response.status()).toBe(404);
  });

  test("Delete an existing Booking with an Authorization Cookie", async ({ request }) => {
    const token = await getAuthorizationCookie(request);

    let response = await request.delete(`${bookingEndpoint}/7`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    expect(response.status()).toBe(201);

    response = await request.get(`${bookingEndpoint}/7`);
    expect(response.status()).toBe(404);
  });
});

async function getAuthorizationCookie(request): Promise<string> {
  const authResponse = await request.post(authEndpoint, {
    data: {
      username: "admin",
      password: "password123",
    },
  });
  expect(authResponse.status()).toBe(200);
  const authResponseBody = await authResponse.json();
  expect(authResponseBody.token).toBeTruthy();
  const token = authResponseBody.token;

  return token;
}