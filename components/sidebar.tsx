"use client";

import { useSidebarStore } from "@/store/sidebar-store";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Sidebar() {
  const { isOpen, toggle } = useSidebarStore();
  const { user } = useUser();

  // Mock projects data - replace with real data later
  const projects = [
    { id: 1, name: "Project Alpha" },
    { id: 2, name: "Project Beta" },
    { id: 3, name: "Project Gamma" },
  ];

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
            <Image
              src="/froggy-transparent-bg.png"
              alt="Froggy"
              width={32}
              height={32}
              className="shrink-0"
            />
            <h1 className="text-lg font-bold">Froggy</h1>
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
          <Button className="w-full justify-start gap-2" variant="ghost">
            <PlusIcon className="size-4" />
            New Project
          </Button>
        ) : (
          <Button size="icon" title="New Project">
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
            {projects.map((project) => (
              <Link href={`/project/${project.id}`} key={project.id}>
                <Button
                  key={project.id}
                  className="justify-start w-full"
                  variant="ghost"
                >
                  {project.name}
                </Button>
              </Link>
            ))}
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
