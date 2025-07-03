import { type LucideIcon } from "lucide-react";
import { z } from "zod";

export type Profile = {
    name: string;
    description: string;
    profilePictureUrl: string;
    location: string;
    socials: Social[];
}

export type Project = {
    slug?: string;
    name: string;
    description: string;
    shortDescription: string;
    bannerUrl: string;
    imageUrl: string[];
    technologies: Technology[];
    role: Role[];
    repositoryUrl?: string;
    liveUrl?: string;
    isFeatured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type Social = {
    id: string;
    name: string;
    url: string;
    icon?: LucideIcon;
}

export type Technology = {
    name: string;
}

export type Role = {
    name: string;
}

export type WorkExperience = {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
}

export type Education = {
    id: string;
    name: string;
    institution: string;
    degree: string;
    startDate: Date;
    endDate: Date;
}

export type Certification = {
    id: string;
    name: string;
    issuer: string;
    startDate: Date;
    endDate?: Date;
    credentialId?: string;
    url?: string;
}

export type AwardOrHonor = {
    id: string;
    name: string;
    institution: string;
    description?: string;
    date: Date;
    url?: string;
}

export type Publication = {
    id: string;
    title: string;
    authors: string[];
    date: Date;
    url?: string;
}

export type Language = {
    id: string;
    name: string;
    proficiency: "Beginner" | "Intermediate" | "Advanced" | "Fluent" | "Native";
    level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
    url?: string;
}

export type CV = {
    technologies: Technology[];
    roles: Role[];
    workExperiences: WorkExperience[];
    educations: Education[];
    certifications: Certification[];
    awardOrHonors: AwardOrHonor[];
    publications: Publication[];
    languages: Language[];
}


export interface ComboboxItem {
    value: string;
    label: string;
}

// Social
export const socialSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    url: z.string().url().or(z.literal('')),
    icon: z.any().optional(),
});

// Technology
export const technologySchema = z.object({
    name: z.string().min(1),
});

// Role
export const roleSchema = z.object({
    name: z.string().min(1),
});

// Work Experience
export const workExperienceSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    description: z.string().min(5),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
});

// Education
export const educationSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    institution: z.string().min(2),
    degree: z.string().min(2),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
});

// Certification
export const certificationSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    issuer: z.string().min(2),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    credentialId: z.string().optional(),
    url: z.string().url().or(z.literal('')).optional(),
});

// Award or Honor
export const awardOrHonorSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    institution: z.string().min(2),
    description: z.string().optional(),
    date: z.coerce.date(),
    url: z.string().url().or(z.literal('')).optional(),
});

// Publication
export const publicationSchema = z.object({
    id: z.string(),
    title: z.string().min(2),
    authors: z.array(z.string().min(2)),
    date: z.coerce.date(),
    url: z.string().url().or(z.literal('')).optional(),
});

// Language
export const languageSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    proficiency: z.enum([
        "Beginner",
        "Intermediate",
        "Advanced",
        "Fluent",
        "Native",
    ]),
    level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
    url: z.string().url().or(z.literal('')).optional(),
});

// Project
export const projectSchema = z.object({
    slug: z.string().optional(),
    name: z.string().min(2, "Name is required"),
    description: z.string({
        required_error: "Description is required",
    }).min(5, "Description must be at least 5 characters"),
    shortDescription: z.string({
        required_error: "Short description is required",
    }).min(5, "Short description must be at least 5 characters"),
    bannerUrl: z.string().nonempty("Banner image is required"),
    imageUrl: z.array(z.string()),
    technologies: z.array(technologySchema).min(1, "At least one technology is required"),
    role: z.array(roleSchema).min(1, "At least one role is required"),
    repositoryUrl: z.string().url().or(z.literal("")).optional(),
    liveUrl: z.string().url().or(z.literal("")).optional(),
    isFeatured: z.boolean(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

// Profile
export const profileSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(5),
    profilePictureUrl: z.string(),
    location: z.string().min(2),
    socials: z.array(socialSchema),
});

// CV
const updateCVSchema = z.object({
    technologies: z.array(technologySchema),
    roles: z.array(roleSchema),
    workExperiences: z.array(workExperienceSchema),
    educations: z.array(educationSchema),
    certifications: z.array(certificationSchema),
    awardOrHonors: z.array(awardOrHonorSchema),
    publications: z.array(publicationSchema),
    languages: z.array(languageSchema),
});

export const cvStoreSchema = z.object({
    cv: updateCVSchema,
    profile: profileSchema,
});

export type Data = {
    cv: CV,
    projects: Project[],
    profile: Profile,
}