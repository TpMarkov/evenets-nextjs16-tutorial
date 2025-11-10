"use server";
import Event, {IEvent} from "@/database/event.model";
import connectDB from "@/lib/mongodb";
// @ts-nocheck
export const getSimilarEventsBySlug = async (slug: string): Promise<IEvent[]> => {
    try {
        await connectDB();

        const event = await Event.findOne({slug}).lean<IEvent>().exec();

        if (!event || !event.tags || event.tags.length === 0) {
            return []; // always return array
        }

        // ✅ FIXED: make this an array of IEvent
        return await Event.find({
            _id: {$ne: event._id},
            tags: {$in: event.tags},
        })
            .lean<IEvent[]>()
            .exec();

    } catch (err) {
        console.error("Error fetching similar events:", err);
        return [];
    }
};
