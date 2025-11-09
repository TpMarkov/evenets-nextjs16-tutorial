import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event, IEvent } from '@/database';

/**
 * GET /api/events/[slug]
 * Fetches a single event by its unique slug identifier
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing the slug
 * @returns Event data or error response with appropriate status code
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<IEvent | { error: string }>> {
  try {
    // Validate slug parameter exists
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    // Validate slug format (alphanumeric with hyphens only)
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugPattern.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    // Establish database connection
    await connectDB();

    // Query event by slug with lean() for better performance
    const event = await Event.findOne({ slug }).lean<IEvent>().exec();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { error: `Event with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    // Return successful response with event data
    return NextResponse.json(event, { status: 200 });

  } catch (error) {
    // Log error for debugging (consider using proper logging service in production)
    console.error('Error fetching event by slug:', error);

    // Handle Mongoose validation or cast errors
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid slug format provided' },
        { status: 400 }
      );
    }

    // Return generic error response for unexpected errors
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the event' },
      { status: 500 }
    );
  }
}
