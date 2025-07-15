"use server";

import { readFile, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";
import {
  ProjectSchema,
  TechnologySchema,
  RoleSchema,
  type Profile,
  type Project,
  type Technology,
  type Role,
  Data,
  CVStoreSchema,
} from "@/types/types";
import { generateSlug } from "@/lib/utils";
import { mkdir } from "fs/promises";

const DATA_FILE = join(process.cwd(), "data.json");

// Helper function to generate unique slug for projects
async function generateUniqueSlug(
  name: string,
  data: Data,
  excludeSlug?: string
): Promise<string> {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (data.projects.some((p) => p.slug === slug && p.slug !== excludeSlug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// Helper function to read data from JSON file
async function readData(): Promise<Data> {
  try {
    const fileContent = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error(
      `Failed to read data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Helper function to write data to JSON file
async function writeData(data: Data): Promise<void> {
  try {
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(
      `Failed to write data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// IMAGE UPLOAD ACTION
export async function uploadImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error:
          "Invalid file type. Only JPEG, PNG, WebP, and GIF files are allowed.",
      };
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: "File size too large. Maximum size is 5MB.",
      };
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create uploads directory:", error);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}-${randomStr}.${extension}`;

    // Save file to public/uploads directory
    const filepath = join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${filename}`;

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: `Failed to upload image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

// DELETE IMAGE ACTION
export async function deleteImage(filename: string) {
  try {
    const filepath = join(process.cwd(), "public", filename);
    await unlink(filepath);
  } catch (error) {
    throw new Error(
      `Failed to delete image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// PROFILE ACTIONS
export async function readProfile(): Promise<Profile | null> {
  try {
    const data = await readData();
    return data.profile;
  } catch (error) {
    throw new Error(
      `Failed to read profile: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// PROJECT ACTIONS
export async function createProject(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const data = await readData();
    const slug = await generateUniqueSlug(name, data);

    const rawData = {
      slug,
      name,
      description: formData.get("description") as string,
      shortDescription: formData.get("shortDescription") as string,
      bannerUrl: (formData.get("bannerUrl") as string) || undefined,
      imageUrl: JSON.parse((formData.get("imageUrl") as string) || "[]"),
      technologies: JSON.parse(
        (formData.get("technologies") as string) || "[]"
      ),
      role: JSON.parse((formData.get("role") as string) || "[]"),
      repositoryUrl: (formData.get("repositoryUrl") as string) || undefined,
      liveUrl: (formData.get("liveUrl") as string) || undefined,
      isFeatured: formData.get("isFeatured") === "true",
      createdAt: formData.get("createdAt") as string,
    };

    const validatedFields = ProjectSchema.safeParse(rawData);

    if (!validatedFields.success) {
      throw new Error(
        `Validation failed: ${JSON.stringify(
          validatedFields.error.flatten().fieldErrors
        )}`
      );
    }

    data.projects.push(validatedFields.data);
    await writeData(data);

    revalidatePath("/projects");
    return slug;
  } catch (error) {
    throw new Error(
      `Failed to create project: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function updateProject(formData: FormData) {
  try {
    const slug = formData.get("slug") as string;
    if (!slug) {
      throw new Error("Project slug is required");
    }

    const rawData = {
      slug,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      shortDescription: formData.get("shortDescription") as string,
      bannerUrl: (formData.get("bannerUrl") as string) || undefined,
      imageUrl: JSON.parse((formData.get("imageUrl") as string) || "[]"),
      technologies: JSON.parse(
        (formData.get("technologies") as string) || "[]"
      ),
      role: JSON.parse((formData.get("role") as string) || "[]"),
      repositoryUrl: (formData.get("repositoryUrl") as string) || undefined,
      liveUrl: (formData.get("liveUrl") as string) || undefined,
      isFeatured: formData.get("isFeatured") === "true",
      createdAt: formData.get("createdAt") as string,
    };

    const validatedFields = ProjectSchema.safeParse(rawData);
    console.log("validatedFields:", validatedFields);
    if (!validatedFields.success) {
      throw new Error(
        `Validation failed: ${JSON.stringify(
          validatedFields.error.flatten().fieldErrors
        )}`
      );
    }

    const data = await readData();
    const projectIndex = data.projects.findIndex((p) => p.slug === slug);

    if (projectIndex === -1) {
      throw new Error(`Project with slug "${slug}" not found`);
    }

    data.projects[projectIndex] = validatedFields.data;
    await writeData(data);
    revalidatePath("/projects");
    return {
      success: true,
      message: "Project updated successfully",
      slug: validatedFields.data.slug,
    };
  } catch (error) {
    throw new Error(
      `Failed to update project: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function readProject(slug: string): Promise<Project | null> {
  try {
    const data = await readData();
    const project = data.projects.find((p) => p.slug === slug);
    return project || null;
  } catch (error) {
    throw new Error(
      `Failed to read project: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function listProjects(): Promise<Project[]> {
  try {
    const data = await readData();
    return data.projects.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });
  } catch (error) {
    throw new Error(
      `Failed to list projects: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// CV ACTIONS
export async function readCV(): Promise<Data | null> {
  try {
    const data = await readData();
    return data;
  } catch (error) {
    throw new Error(
      `Failed to read CV: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function updateCV(cv: Data) {
  try {
    const validatedFields = CVStoreSchema.safeParse(cv);

    if (!validatedFields.success) {
      throw new Error(
        `Validation failed: ${JSON.stringify(
          validatedFields.error.flatten().fieldErrors
        )}`
      );
    }

    const data = await readData();
    await writeData({ ...data, ...validatedFields.data });
    revalidatePath("/");
    return { success: true, message: "CV updated successfully" };
  } catch (error) {
    throw new Error(
      `Failed to update CV: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// SOCIAL ACTIONS
export async function listSocials() {
  try {
    const data = await readData();
    return data.profile.socials;
  } catch (error) {
    throw new Error(
      `Failed to list socials: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// TECHNOLOGY ACTIONS
export async function listTechnologies(): Promise<Technology[]> {
  try {
    const data = await readData();
    return data.cv.technologies;
  } catch (error) {
    throw new Error(
      `Failed to list technologies: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function createTechnology(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
    };

    const validatedFields = TechnologySchema.safeParse(rawData);

    if (!validatedFields.success) {
      throw new Error(
        `Validation failed: ${JSON.stringify(
          validatedFields.error.flatten().fieldErrors
        )}`
      );
    }

    const data = await readData();

    // Check if technology with same name already exists
    const existingTechnology = data.cv.technologies.find(
      (t) => t.name === validatedFields.data.name
    );
    if (existingTechnology) {
      throw new Error(
        `Technology with name "${validatedFields.data.name}" already exists`
      );
    }

    data.cv.technologies.push(validatedFields.data);
    await writeData(data);

    revalidatePath("/admin/technologies");
    return { success: true, message: "Technology added successfully" };
  } catch (error) {
    throw new Error(
      `Failed to create technology: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// ROLE ACTIONS
export async function listRoles(): Promise<Role[]> {
  try {
    const data = await readData();
    return data.cv.roles;
  } catch (error) {
    throw new Error(
      `Failed to list roles: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function createRole(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
    };

    const validatedFields = RoleSchema.safeParse(rawData);

    if (!validatedFields.success) {
      throw new Error(
        `Validation failed: ${JSON.stringify(
          validatedFields.error.flatten().fieldErrors
        )}`
      );
    }

    const data = await readData();

    // Check if role with same name already exists
    const existingRole = data.cv.roles.find(
      (r) => r.name === validatedFields.data.name
    );
    if (existingRole) {
      throw new Error(
        `Role with name "${validatedFields.data.name}" already exists`
      );
    }

    data.cv.roles.push(validatedFields.data);
    await writeData(data);

    revalidatePath("/admin/roles");
    return { success: true, message: "Role added successfully" };
  } catch (error) {
    throw new Error(
      `Failed to create role: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// PROJECT TECHNOLOGIES AND ROLES EXTRACTION
export async function getProjectTechnologiesAndRoles(): Promise<{
  technologies: Technology[];
  roles: Role[];
}> {
  try {
    const data = await readData();

    // Extract all technologies from all projects
    const allTechnologies = data.projects.flatMap(
      (project) => project.technologies
    );

    // Extract all roles from all projects
    const allRoles = data.projects.flatMap((project) => project.role);

    // Remove duplicates based on name
    const uniqueTechnologies = allTechnologies.filter(
      (tech, index, array) =>
        array.findIndex((t) => t.name === tech.name) === index
    );

    const uniqueRoles = allRoles.filter(
      (role, index, array) =>
        array.findIndex((r) => r.name === role.name) === index
    );

    return {
      technologies: uniqueTechnologies,
      roles: uniqueRoles,
    };
  } catch (error) {
    throw new Error(
      `Failed to get project technologies and roles: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// DELETE PROJECT ACTION
export async function deleteProject(slug: string) {
  try {
    const data = await readData();
    const projectIndex = data.projects.findIndex((p) => p.slug === slug);
    if (projectIndex === -1) {
      throw new Error(`Project with slug "${slug}" not found`);
    }
    data.projects.splice(projectIndex, 1);
    await writeData(data);
    revalidatePath(`/project/${slug}`);
  } catch (error) {
    throw new Error(
      `Failed to delete project: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
