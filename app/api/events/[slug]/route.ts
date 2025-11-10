import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import {Event, IEvent} from "@/database";

export async function GET(
    request: NextRequest,
    {params}: { params: { slug: string } }
): Promise<NextResponse<{ message?: string; event?: IEvent; error?: string }>> {
    try {
        await connectDB();

        const {slug} = params;

        if (!slug) {
            return NextResponse.json({error: "Slug parameter is required"}, {status: 400});
        }

        const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugPattern.test(slug)) {
            return NextResponse.json(
                {error: "Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens"},
                {status: 400}
            );
        }

        const event = await Event.findOne({slug}).lean<IEvent>().exec();
        if (!event) {
            return NextResponse.json({error: `Event with slug '${slug}' not found`}, {status: 404});
        }

        return NextResponse.json({message: "Event fetched", event}, {status: 200});
    } catch (error) {
        console.error("Error fetching event by slug:", error);
        return NextResponse.json(
            {error: "An unexpected error occurred while fetching the event"},
            {status: 500}
        );
    }
}
