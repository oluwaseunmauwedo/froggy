import { getActivityById } from "@/lib/db/queries/activities";
import { getProjectById } from "@/lib/db/queries/projects";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const activity = await getActivityById(id);

    if (!activity) {
      return new Response("Activity not found", { status: 404 });
    }

    // If published, anyone can access
    if (activity.isPublished) {
      return new Response(activity.code, {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    // If not published, check if user is the creator
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const project = await getProjectById(activity.projectId, userId);
    if (!project) {
      return new Response("Forbidden", { status: 403 });
    }

    // User is the creator, allow access
    return new Response(activity.code, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
