import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model"
import {v2 as cloudinary} from "cloudinary"

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

        const file = formData.get("image") as File

        if (!file) {
            return NextResponse.json({message: "Image file is required"}, {status: 400})
        }
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const uploadedResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: "image",
                folder: "nextjs16-tutorial"
            }, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            }).end(buffer)
        })
        event.image = (uploadedResult as { secure_url: string }).secure_url

        const createdEvent = await Event.create(event)


        return NextResponse.json({message: "Event created", createdEvent}, {status: 200})

    } catch (err) {
        return NextResponse.json({message: "Failed to create Event"}, {status: 500})
    }

}

export async function GET() {
    try {
        await connectDB()
        const events = await Event.find().sort({createdAt: -1})

        return NextResponse.json({message: "Events fetched", events}, {status: 200})

    } catch (err) {
        return NextResponse.json({message: "Failed to fetch Events", error: err}, {status: 500})
    }
}

