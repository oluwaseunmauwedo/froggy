"use client";

import { useSidebarStore } from "@/store/sidebar-store";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Project } from "@/lib/db/queries/projects";
import { useRouter, usePathname } from "next/navigation";
import { ProjectListItem } from "@/components/project-list-item";

export function Sidebar() {
  const { isOpen, hasHydrated, toggle } = useSidebarStore();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axios.get("/api/projects");
      return data;
    },
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      const name = `Untitled ${formattedDate}`;

      const { data } = await axios.post("/api/projects", { name });
      return data;
    },
    onSuccess: (newProject: Project) => {
      // Update the projects list
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Navigate to the new project
      router.push(`/project/${newProject.id}`);
    },
  });

  const handleCreateProject = () => {
    createProjectMutation.mutate();
  };

  if (!hasHydrated) {
    return null;
  }

  return (
    <aside
      className={cn(
        "h-screen border-r flex flex-col transition-width duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-3 relative p-3 px-4",
          isOpen ? "" : "justify-center"
        )}
      >
        {isOpen ? (
          <>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/froggy-transparent-bg.png"
                alt="Froggy"
                width={32}
                height={32}
                className="shrink-0"
              />
              <h1 className="text-lg font-bold">Froggy</h1>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="ml-auto"
            >
              <PanelLeftIcon />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="relative group/logo"
          >
            <Image
              src="/froggy-transparent-bg.png"
              alt="Froggy"
              width={32}
              height={32}
              className="group-hover/logo:opacity-0 transition-opacity absolute"
            />
            <PanelLeftIcon className="opacity-0 group-hover/logo:opacity-100 transition-opacity" />
          </Button>
        )}
      </div>

      {/* New Project Button */}
      <div className={cn("p-3 px-2", !isOpen && "flex justify-center")}>
        {isOpen ? (
          <Button
            className="w-full justify-center gap-2"
            variant="outline"
            onClick={handleCreateProject}
            disabled={createProjectMutation.isPending}
          >
            <PlusIcon className="size-4" />
            {createProjectMutation.isPending ? "Creating..." : "New Project"}
          </Button>
        ) : (
          <Button
            size="icon"
            title="New Project"
            onClick={handleCreateProject}
            disabled={createProjectMutation.isPending}
          >
            <PlusIcon className="" />
          </Button>
        )}
      </div>

      {/* Projects List */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto px-2">
          <div className="flex flex-col gap-1">
            <p className="px-4 py-2 text-xs font-medium text-muted-foreground">
              Projects
            </p>
            {isLoading ? (
              <p className="px-4 py-2 text-sm text-muted-foreground">
                Loading...
              </p>
            ) : projects.length === 0 ? (
              <p className="px-4 py-2 text-sm text-muted-foreground">
                No projects yet
              </p>
            ) : (
              projects.map((project) => {
                const isActive = pathname === `/project/${project.id}`;
                return (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    isActive={isActive}
                  />
                );
              })
            )}
          </div>
        </div>
      )}
      {!isOpen && <div className="flex-1" />}

      {/* User Profile */}
      <div className="p-3">
        <div
          className={cn(
            "flex items-center",
            isOpen ? "gap-3" : "justify-center"
          )}
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8",
              },
            }}
          />
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
