"use server"
import Event, {IEvent} from "@/database/event.model"
import connectDB from "@/lib/mongodb";
import {NextResponse} from "next/server";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {

        await connectDB()

        const event = await Event.findOne({slug})

        if (!event) {
            return NextResponse.json({message: "No similar events found"}, {status: 404})
        }

        return await Event.find({
                _id: {$ne: event._id}, tags: {$in: event.tags}
            }
        ).lean()

    } catch {
        return []
    }
}