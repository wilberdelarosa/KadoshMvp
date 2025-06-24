"use server"

import { z } from "zod"
import { Resend } from "resend" // Assuming Resend for email
// For .ics generation:
import * as ics from "ics"
import { format } from "date-fns"

const ReservationFormSchemaServer = z.object({
  firstName: z.string(),
  lastName: z.string(),
  idOrPassport: z.string(),
  phone: z.string(),
  email: z.string().email(),
  pickupDate: z.date(),
  pickupTime: z.string(), // e.g., "10:00"
  returnDate: z.date(),
  returnTime: z.string(),
  additionalComments: z.string().optional(),
  vehicleId: z.string().optional(),
  vehicleName: z.string().optional(),
})

type ReservationFormDataServer = z.infer<typeof ReservationFormSchemaServer>

// Initialize Resend with API key from environment variables
// const resend = new Resend(process.env.RESEND_API_KEY);
// For Next.js, we'll simulate email sending if RESEND_API_KEY is not available.

function combineDateAndTime(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number)
  const newDate = new Date(date)
  newDate.setHours(hours, minutes, 0, 0)
  return newDate
}

export async function submitReservation(formData: ReservationFormDataServer) {
  try {
    const validation = ReservationFormSchemaServer.safeParse(formData)
    if (!validation.success) {
      return { success: false, message: "Invalid form data.", errors: validation.error.flatten().fieldErrors }
    }

    const data = validation.data
    const KADOSH_EMAIL = "info.webnovalab@gmail.com" // As specified

    const emailSubject = `New Vehicle Reservation: ${data.vehicleName || "N/A"} - ${data.firstName} ${data.lastName}`
    const emailBody = `
      <h1>New Vehicle Reservation Request</h1>
      <p><strong>Vehicle:</strong> ${data.vehicleName || "Not specified (General Inquiry)"} (ID: ${data.vehicleId || "N/A"})</p>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>ID/Passport:</strong> ${data.idOrPassport}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Pickup:</strong> ${format(data.pickupDate, "PPP")} at ${data.pickupTime}</p>
      <p><strong>Return:</strong> ${format(data.returnDate, "PPP")} at ${data.returnTime}</p>
      <p><strong>Comments:</strong> ${data.additionalComments || "None"}</p>
    `

    // Simulate email sending if RESEND_API_KEY is not set (common in dev/Next.js)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: "Kadosh RentCar <noreply@yourdomain.com>", // Replace with your verified Resend domain
        to: KADOSH_EMAIL,
        replyTo: data.email,
        subject: emailSubject,
        html: emailBody,
      })
    } else {
      console.log("SIMULATING EMAIL SEND (RESEND_API_KEY not set):")
      console.log("To:", KADOSH_EMAIL)
      console.log("Subject:", emailSubject)
      console.log("Body:", emailBody)
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Generate .ics file content
    const pickupDateTime = combineDateAndTime(data.pickupDate, data.pickupTime)
    const returnDateTime = combineDateAndTime(data.returnDate, data.returnTime)

    const event: ics.EventAttributes = {
      start: [
        pickupDateTime.getFullYear(),
        pickupDateTime.getMonth() + 1,
        pickupDateTime.getDate(),
        pickupDateTime.getHours(),
        pickupDateTime.getMinutes(),
      ],
      end: [
        returnDateTime.getFullYear(),
        returnDateTime.getMonth() + 1,
        returnDateTime.getDate(),
        returnDateTime.getHours(),
        returnDateTime.getMinutes(),
      ],
      title: `Kadosh RentCar Reservation: ${data.vehicleName || "Vehicle"}`,
      description: `Reservation for ${data.firstName} ${data.lastName}. Vehicle: ${data.vehicleName || "N/A"}. Pickup: ${format(pickupDateTime, "Pp")}, Return: ${format(returnDateTime, "Pp")}. Contact: ${data.phone}, ${data.email}. Comments: ${data.additionalComments || "None"}`,
      location: "Kadosh RentCar, Punta Cana",
      organizer: { name: "Kadosh RentCar", email: KADOSH_EMAIL },
      attendees: [
        {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          rsvp: true,
          partstat: "NEEDS-ACTION",
          role: "REQ-PARTICIPANT",
        },
      ],
    }

    const { error, value } = ics.createEvent(event)
    if (error) {
      console.error("ICS generation error:", error)
      return { success: true, message: "Reservation email sent, but failed to generate calendar file.", icsData: null }
    }

    return { success: true, message: "Reservation request sent successfully!", icsData: value }
  } catch (error) {
    console.error("Reservation submission error:", error)
    return { success: false, message: "An unexpected error occurred." }
  }
}
