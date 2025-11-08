import React from 'react'
import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string
    image: string
    date: string
    slug: string
    time: string
    location: string
}

const EventCard = ({title, image, date, slug, time, location}: Props) => {
    return (
        <Link href={`/events/${slug}`} id={"event-card"}>
            <Image src={image} alt={"event-image"} width={410} height={300}/>
            <div className="flex flex-row gap-2">
                <Image src={"icons/pin.svg"} alt={"location"} width={14} height={14}/>
                <p>{location}</p>
            </div>
            <p className={"titlе"}>{title}</p>

            <div className="datetime">
                <div>
                    <Image src={"icons/calendar.svg"} alt={"date"} width={14} height={14}/>
                    <p>{date}</p>
                </div>
                <div>
                    <Image src={"icons/clock.svg"} alt={"date"} width={14} height={14}/>
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}
export default EventCard
