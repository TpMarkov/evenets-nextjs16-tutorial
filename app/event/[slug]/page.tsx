import React from 'react'
import {notFound} from "next/navigation";
import Image from "next/image";


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
const EventDetailsPage = async ({params}: Promise<{ slug: string }>) => {
    const {slug} = await params

    const response = await fetch(`${BASE_URL}/api/events/${slug}`)
    const {event} = await response.json()


    if (!event) {
        return notFound()
    }

    const {title, tags, location, date, overview, time, description, mode, organizer, agenda, audience, image} = event

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
                    <EventAgenda agendaItems={JSON.parse(agenda[0])}/>

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={JSON.parse(tags[0])}/>


                </div>

                {/* Right Side - Booking details */}
                <aside className={"booking"}>
                    <p className={"text-lg font-semibold"}>Book Event</p>
                </aside>
            </div>
        </section>
    )
}
export default EventDetailsPage
