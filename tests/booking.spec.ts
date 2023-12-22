import { test, expect } from "@playwright/test";

test.describe("Verify the Get Booking Ids endpoint [GET /booking]", () => {
  test("Retrieving all Booking Ids", async ({ request }) => {
    const response = await request.get("https://restful-booker.herokuapp.com/booking");
    expect(response).toBeOK();
  });

  test("Retrieving all Bookings for Sally Brown", async ({ request }) => {
    const response = await request.get("https://restful-booker.herokuapp.com/booking?firstname=Sally&lastname=Brown");
    expect(response).toBeOK();
    const responseBody = await response.json();
    expect(responseBody).toBeTruthy();
    responseBody.forEach((element: { bookingid: number }) => {
      expect(element.bookingid).toBeGreaterThan(0);
    });
  });
});

test.describe("Verify the Get Booking endpoint [GET /booking/:id]", () => {
  test("Retrieving an existing Booking by the Booking Id", async ({ request }) => {
    const response = await request.get("https://restful-booker.herokuapp.com/booking/2");
    expect(response).toBeOK();
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

    const response = await request.get("https://restful-booker.herokuapp.com/booking/2");
    expect(response).toBeOK();
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

    const response = await request.post("https://restful-booker.herokuapp.com/booking", {
      headers: {
        ContentType: "application/json",
        Accept: "application/json",
      },
      data: newBookingObject,
    });
    expect(response).toBeOK();
    const responseBody = await response.json();
    expect(responseBody.booking).toMatchObject(newBookingObject);
    expect(responseBody.bookingid).toBeGreaterThan(0);
  });
});
