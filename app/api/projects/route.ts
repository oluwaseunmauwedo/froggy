import { auth } from "@clerk/nextjs/server";
import { getProjectsByUserId, createProject } from "@/lib/db/queries/projects";

// GET /api/projects - List all projects for the authenticated user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await getProjectsByUserId(userId);

    return Response.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return Response.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const newProject = await createProject({
      name: name.trim(),
      createdBy: userId,
    });

    return Response.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return Response.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
