import mongoose, {Document, Model, Schema} from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
    eventId: mongoose.Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, 'Event ID is required'],
            index: true, // Index for faster queries when fetching bookings by event
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            validate: {
                validator: (value: string) => {
                    // RFC 5322 simplified email validation regex
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value);
                },
                message: 'Please provide a valid email address',
            },
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

/**
 * Pre-save hook to verify that the referenced event exists
 * Prevents orphaned bookings by validating the event reference
 */
BookingSchema.pre('save', async function (next) {
    // Only validate eventId if it's modified or document is new
    if (this.isModified('eventId')) {
        try {
            // Dynamically import Event model to avoid circular dependency issues
            const Event = mongoose.model('Event');

            // Check if the event exists in the database
            const eventExists = await Event.exists({_id: this.eventId});

            if (!eventExists) {
                return next(new Error('Event does not exist. Cannot create booking for non-existent event.'));
            }
        } catch (error) {
            // Handle case where Event model might not be registered yet
            if (error instanceof Error && error.message.includes('Schema hasn\'t been registered')) {
                return next(new Error('Event model not found. Please ensure Event model is registered.'));
            }
            return next(error as Error);
        }
    }

    next();
});

// Create index on eventId for faster queries
BookingSchema.index({eventId: 1});

// Create compound index for common queries (event bookings by date)
BookingSchema.index({eventId: 1, createdAt: -1})

// Create index on email for user booking lookups
BookingSchema.index({email: 1})


// Enforce one booking per event per email
BookingSchema.index({eventId: 1, email: 1}, {unique: true, name: "unique_event_email"})

// Prevent model recompilation during hot reloads in development
const Booking: Model<IBooking> =
    mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
