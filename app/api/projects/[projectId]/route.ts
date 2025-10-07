import { auth } from "@clerk/nextjs/server";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "@/lib/db/queries/projects";

// GET /api/projects/[projectId] - Get a specific project
export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const project = await getProjectById(projectId, userId);

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    return Response.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return Response.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// PATCH /api/projects/[projectId] - Update a project
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const updatedProject = await updateProject(projectId, userId, {
      name: name.trim(),
    });

    if (!updatedProject) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    return Response.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return Response.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[projectId] - Delete a project
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const success = await deleteProject(projectId, userId);

    if (!success) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    return Response.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return Response.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
