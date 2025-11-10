import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import {NextResponse} from "next/server";
import Booking from "@/database/booking.model";

export async function POST(req: Request) {
    try {
        const {eventId, email, slug} = await req.json();

        // Check if eventId is a valid Mongo ObjectId
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return NextResponse.json(
                {success: false, error: "Invalid eventId"},
                {status: 400}
            );
        }

        await connectDB();

        // Convert string to ObjectId
        const booking = await Booking.create({
            eventId: new mongoose.Types.ObjectId(eventId),
            email,
            slug,
        });

        return NextResponse.json({success: true, booking});
    } catch (err: any) {
        console.error(err);

        // Check for duplicate booking (unique index)
        if (err.code === 11000) {
            return NextResponse.json(
                {success: false, error: "You have already booked this event"},
                {status: 409}
            );
        }

        return NextResponse.json({success: false, error: err.message}, {status: 500});
    }
}
