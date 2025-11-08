import mongoose, {Document, Model, Schema} from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters"],
        },
        overview: {
            type: String,
            required: [true, 'Overview is required'],
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Image is required'],
        },
        venue: {
            type: String,
            required: [true, 'Venue is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
        },
        time: {
            type: String,
            required: [true, 'Time is required'],
        },
        mode: {
            type: String,
            required: [true, 'Mode is required'],
            enum: {
                values: ['online', 'offline', 'hybrid'],
                message: 'Mode must be either online, offline, or hybrid',
            },
        },
        audience: {
            type: String,
            required: [true, 'Audience is required'],
            trim: true,
        },
        agenda: {
            type: [String],
            required: [true, 'Agenda is required'],
            validate: {
                validator: (value: string[]) => value.length > 0,
                message: 'Agenda must contain at least one item',
            },
        },
        organizer: {
            type: String,
            required: [true, 'Organizer is required'],
            trim: true,
        },
        tags: {
            type: [String],
            required: [true, 'Tags are required'],
            validate: {
                validator: (value: string[]) => value.length > 0,
                message: 'Tags must contain at least one item',
            },
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

/**
 * Pre-save hook to generate slug and validate/normalize date and time
 * Runs before every save operation
 */
EventSchema.pre('save', function (next) {
    // Generate slug only if title is modified or document is new
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    // Validate and normalize date to ISO format (YYYY-MM-DD)
    if (this.isModified('date')) {
        const dateObj = new Date(this.date);

        if (isNaN(dateObj.getTime())) {
            return next(new Error('Invalid date format. Please provide a valid date.'));
        }

        // Store date in ISO format (YYYY-MM-DD)
        this.date = dateObj.toISOString().split('T')[0];
    }

    // Normalize time format to HH:MM (24-hour format)
    if (this.isModified('time')) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

        if (!timeRegex.test(this.time)) {
            return next(new Error('Invalid time format. Please use HH:MM format (e.g., 14:30).'));
        }

        // Ensure time is zero-padded (e.g., 9:30 becomes 09:30)
        const [hours, minutes] = this.time.split(':');
        this.time = `${hours.padStart(2, '0')}:${minutes}`;
    }

    next();
});



// Prevent model recompilation during hot reloads in development
const Event: Model<IEvent> =
    mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
