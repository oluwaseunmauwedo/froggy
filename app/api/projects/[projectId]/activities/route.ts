import { getActivitiesByProjectId } from "@/lib/db/queries/activities";
import { getProjectById } from "@/lib/db/queries/projects";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { userId } = await auth();

  // Get all activities is only allowed for creator of project
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the project belongs to the user
  const project = await getProjectById(projectId, userId);
  if (!project) {
    return Response.json(
      { error: "Project not found or unauthorized" },
      { status: 404 }
    );
  }

  try {
    const activities = await getActivitiesByProjectId(projectId);
    return Response.json({ activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return Response.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
