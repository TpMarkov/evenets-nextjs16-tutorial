import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model"

export async function POST(req: NextRequest) {

    try {
        await connectDB()
        const formData = await req.formData()

        let event

        try {
            event = Object.fromEntries(formData.entries())
        } catch (err) {
            return NextResponse.json({message: err instanceof Error ? err.message : "Unknown"}, {status: 500})
        }

        const createdEvent = await Event.create(event)

        return NextResponse.json({message: "Event created", createdEvent}, {status: 200})

    } catch (err) {
        return NextResponse.json({message: "Failed to create Event"}, {status: 500})
    }


}