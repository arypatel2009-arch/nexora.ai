import { getProjects, getProjectBySlug } from "@/lib/data";
import { jsonOk, jsonError } from "@/lib/api/response";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");

  if (slug) {
    const project = await getProjectBySlug(slug);
    if (!project) return jsonError("Project not found.", 404);
    return jsonOk(project);
  }

  const projects = await getProjects();
  return jsonOk(projects);
}
