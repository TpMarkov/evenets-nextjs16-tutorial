import React from 'react'
import ExplorerBtn from "@/components/ExplorerBtn";
import EventCard from "@/components/events/EventCard";
import {events} from "@/lib/constants";


const Page = () => {
    return (
        <section>
            <h1 className={"text-center"}>The Hub for Every Day <br/> Event You Can't Miss</h1>
            <p className={"text-center mt-5"}>Hackathons, Meetups, and Conferences, All in One Place</p>
            <ExplorerBtn/>

            <div className={"mt-20 space-y-7"}>
                <h3>Featured Events</h3>

                <ul className={"events"}>
                    {events.map((event) => (
                        <li key={event.title}>
                            <EventCard {...event}/>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
export default Page
