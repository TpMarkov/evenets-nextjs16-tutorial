import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model"

interface createBookingProps {
    eventId: string
    email: string
    slug: string
}

export const createBooking = async ({eventId, email, slug}: createBookingProps) => {
    try {
        await connectDB()
        const booking = (await Booking.create({eventId, email, slug}))

        return {success: true, booking}
    } catch (err) {
        console.error(err)
        return {success: false, error: err}
    }
}