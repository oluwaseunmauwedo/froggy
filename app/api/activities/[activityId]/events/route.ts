import { getActivityById } from "@/lib/db/queries/activities";
import { getProjectById } from "@/lib/db/queries/projects";
import {
  addActivityEvent,
  getActivityEvents,
} from "@/lib/db/queries/activity-events";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ activityId: string }> }
) {
  const { activityId } = await params;

  try {
    const activity = await getActivityById(activityId);

    if (!activity) {
      return Response.json({ error: "Activity not found" }, { status: 404 });
    }

    // Check access: allow if published OR if user is creator
    let canAccess = activity.isPublished;

    if (!canAccess) {
      const { userId } = await auth();
      if (userId) {
        const project = await getProjectById(activity.projectId, userId);
        canAccess = !!project;
      }
    }

    if (!canAccess) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { event, data } = body;

    if (!event || typeof event !== "string") {
      return Response.json(
        { error: "Event name is required" },
        { status: 400 }
      );
    }

    const activityEvent = await addActivityEvent({
      activityId,
      event,
      data: data || null,
    });

    return Response.json({ event: activityEvent }, { status: 201 });
  } catch (error) {
    console.error("Error creating activity event:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ activityId: string }> }
) {
  const { activityId } = await params;

  try {
    const activity = await getActivityById(activityId);

    if (!activity) {
      return Response.json({ error: "Activity not found" }, { status: 404 });
    }

    // Check access: allow if published OR if user is creator
    let canAccess = activity.isPublished;

    if (!canAccess) {
      const { userId } = await auth();
      if (userId) {
        const project = await getProjectById(activity.projectId, userId);
        canAccess = !!project;
      }
    }

    if (!canAccess) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await getActivityEvents(activityId);

    return Response.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching activity events:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
