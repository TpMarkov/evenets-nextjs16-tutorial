export type EventItem = {
    image: string
    title: string
    slug: string
    location: string
    date: string
    time: string
}

export const events: EventItem[] = [
    {
        image: "/images/event1.png",
        title: "Tech Innovators Conference 2025",
        slug: "tech-innovators-conference-2025",
        location: "San Francisco, CA",
        date: "March 15, 2025",
        time: "9:00 AM – 5:00 PM"
    },
    {
        image: "/images/event2.png",
        title: "Summer Music Festival",
        slug: "summer-music-festival",
        location: "Austin, TX",
        date: "July 22, 2025",
        time: "3:00 PM – 11:00 PM"
    },
    {
        image: "/images/event3.png",
        title: "Global Startup Pitch Night",
        slug: "global-startup-pitch-night",
        location: "Berlin, Germany",
        date: "September 10, 2025",
        time: "6:00 PM – 9:30 PM"
    },
    {
        image: "/images/event4.png",
        title: "International Art Exhibition ‘Visions’",
        slug: "international-art-exhibition-visions",
        location: "Paris, France",
        date: "October 18, 2025",
        time: "10:00 AM – 8:00 PM"
    },
    {
        image: "/images/event5.png",
        title: "Outdoor Film & Food Experience",
        slug: "outdoor-film-food-experience",
        location: "Sydney, Australia",
        date: "November 5, 2025",
        time: "4:00 PM – 10:00 PM"
    },
    {
        image: "/images/event6.png",
        title: "Winter Charity Gala Dinner",
        slug: "winter-charity-gala-dinner",
        location: "London, UK",
        date: "December 12, 2025",
        time: "7:30 PM – 11:30 PM"
    }
];
