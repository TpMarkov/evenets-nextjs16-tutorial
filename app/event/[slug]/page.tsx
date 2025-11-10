import React from 'react'
import {notFound} from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/events/BookEvent"
import {getSimilarEventsBySlug} from "@/lib/actions/event.actions";
import {IEvent} from "@/database";
import EventCard from "@/components/events/EventCard";
import {cacheLife} from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

interface EventDetailsProps {
    icon: string
    alt: string
    label: string
}


const EventTags = ({tags}: { tags: string[] }) => {
    return (
        <div className={"flex flex-row gap-1.5 flex-wrap"}>
            {tags.map((tag) => (
                <div className={"pill"} key={tag}>
                    {tag}
                </div>
            ))}
        </div>
    )
}

const EventDetailsItem = ({icon, alt, label}: EventDetailsProps) => {
    return (
        <div className="flex-row-gap-2 items-center">
            <Image src={icon} alt={alt} width={17} height={17}/>
            <p>{label}</p>
        </div>
    )
}

const EventAgenda =
    ({agendaItems}: { agendaItems: string[] }) => {
        return (
            <div className={"agenda"}>
                <h2>Agenda</h2>
                <ul>
                    {agendaItems.map(agendaItem => (
                        <li key={agendaItem}>{agendaItem}</li>
                    ))}
                </ul>
            </div>
        )
    }
// @ts-ignore

const EventDetailsPage = async ({params}: Promise<{ slug: string }>) => {
    // "use cache"
    // cacheLife("hours")

    const {slug} = await params

    let event

    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug)

    try {
        const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
            next: {revalidate: 60}
        })
        if (!request.ok) {
            if (request.status === 404) {
                return notFound()
            }
            throw new Error(`Failed to fetch event : ${request.statusText}`)
        }
        const response = await request.json()
        event = response.event

        if (!event) {
            return notFound()
        }

    } catch (error) {
        console.error("Error fetching event", error)
        return notFound()
    }

    const {title, tags, location, date, overview, time, description, mode, organizer, agenda, audience, image} = event
    const bookings = 10


    return (
        <section id={"event"}>
            <div className={"header"}>
                <h1>Event Description</h1>
                <p className={"mt-2"}>{description}</p>
            </div>
            <div className={"details"}>
                {/* Left Side - Event Content */}
                <div className={"content"}>
                    <Image src={image} alt={"Event-image"} width={800} className={"banner"} height={800}/>

                    <section className={"flex-col-gap-2"}>
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className={"flex-col-gap-2"}>
                        <h2>Event Details</h2>
                        <EventDetailsItem icon="/icons/calendar.svg" alt="calendar" label={date}/>
                        <EventDetailsItem icon="/icons/clock.svg" alt="calendar" label={time}/>
                        <EventDetailsItem icon="/icons/pin.svg" alt="calendar" label={location}/>
                        <EventDetailsItem icon="/icons/mode.svg" alt="calendar" label={mode}/>
                        <EventDetailsItem icon="/icons/audience.svg" alt="calendar" label={audience}/>
                    </section>
                    <EventAgenda agendaItems={agenda}/>

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={tags}/>

                </div>

                {/* Right Side - Booking details */}
                <aside className={"booking"}>
                    <div className={"signup-card"}>
                        <h2>Book Your Spot</h2>
                        {bookings > 0 ? <p>Join {bookings} people who have already booked their spot</p> :
                            <p className={"text-sm"}>Be the first to book your spot</p>}
                        <BookEvent eventId={event._id} slug={event.slug}/>
                    </div>

                </aside>
            </div>

            <div className={"w-full flex flex-col gap-4 pt-20"}>
                <h2>Similar Events</h2>
                <div className={"events"}>
                    {similarEvents.length > 0 && similarEvents.map((similarEvent) => (
                        <EventCard key={similarEvent.title} {...similarEvent}/>
                    ))}
                </div>
            </div>
        </section>
    )
}
export default EventDetailsPage
