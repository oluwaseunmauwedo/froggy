import {
  getActivityById,
  updateActivity,
} from "@/lib/db/queries/activities";
import { getProjectById } from "@/lib/db/queries/projects";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ activityId: string }> }
) {
  const { activityId } = await params;

  try {
    // Get the activity to check if it's published
    const activity = await getActivityById(activityId);

    if (!activity) {
      return Response.json({ error: "Activity not found" }, { status: 404 });
    }

    // If published, anyone can access
    if (activity.isPublished) {
      return Response.json({ activity });
    }

    // If not published, must be authenticated and be the project creator
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the project belongs to the user
    const project = await getProjectById(activity.projectId, userId);
    if (!project) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    return Response.json({ activity });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return Response.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ activityId: string }> }
) {
  const { activityId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const activity = await getActivityById(activityId);

    if (!activity) {
      return Response.json({ error: "Activity not found" }, { status: 404 });
    }

    // Verify the project belongs to the user
    const project = await getProjectById(activity.projectId, userId);
    if (!project) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { isPublished } = await request.json();

    const updatedActivity = await updateActivity(activityId, activity.projectId, {
      isPublished,
    });

    if (!updatedActivity) {
      return Response.json({ error: "Failed to update activity" }, { status: 500 });
    }

    return Response.json({ activity: updatedActivity });
  } catch (error) {
    console.error("Error updating activity:", error);
    return Response.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}
