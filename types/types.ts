import { z } from "zod";

// Social Schema
export const SocialSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    url: z.string().url().or(z.literal('')),
    icon: z.any().optional(),
});

// Technology Schema
export const TechnologySchema = z.object({
    name: z.string().min(1),
});

// Role Schema
export const RoleSchema = z.object({
    name: z.string().min(1),
});

// Work Experience Schema
export const WorkExperienceSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    company: z.string().min(2),
    location: z.string().optional(),
    type: z.enum(["Full-time", "Part-time", "Freelance", "Internship", "Volunteer", "Contract", "Other"]).optional(),
    description: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    isCurrent: z.boolean().optional(),
});

// Education Schema
export const EducationSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    institution: z.string().min(2),
    location: z.string().optional(),
    degree: z.string().min(2),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    isCurrent: z.boolean().optional(),
});

// Certification Schema
export const CertificationSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    issuer: z.string().min(2),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    credentialId: z.string().optional(),
    url: z.string().url().or(z.literal('')).optional(),
});

// Award or Honor Schema
export const AwardOrHonorSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    institution: z.string().min(2),
    description: z.string().optional(),
    date: z.coerce.date(),
    url: z.string().url().or(z.literal('')).optional(),
});

// Publication Schema
export const PublicationSchema = z.object({
    id: z.string(),
    title: z.string().min(2),
    authors: z.array(z.string().min(2)),
    date: z.coerce.date(),
    url: z.string().url().or(z.literal('')).optional(),
});

// Language Schema
export const LanguageSchema = z.object({
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

// Project Schema
export const ProjectSchema = z.object({
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
    technologies: z.array(TechnologySchema).min(1, "At least one technology is required"),
    role: z.array(RoleSchema).min(1, "At least one role is required"),
    repositoryUrl: z.string().url().or(z.literal("")).optional(),
    liveUrl: z.string().url().or(z.literal("")).optional(),
    isFeatured: z.boolean(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

// Profile Schema
export const ProfileSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(5),
    profilePictureUrl: z.string(),
    location: z.string().min(2),
    socials: z.array(SocialSchema),
});

// CV Schema
export const CVSchema = z.object({
    technologies: z.array(TechnologySchema),
    roles: z.array(RoleSchema),
    workExperiences: z.array(WorkExperienceSchema),
    educations: z.array(EducationSchema),
    certifications: z.array(CertificationSchema),
    awardOrHonors: z.array(AwardOrHonorSchema),
    publications: z.array(PublicationSchema),
    languages: z.array(LanguageSchema),
});

// ComboboxItem Schema
export const ComboboxItemSchema = z.object({
    value: z.string(),
    label: z.string(),
});

// Data Schema
export const DataSchema = z.object({
    cv: CVSchema,
    projects: z.array(ProjectSchema),
    profile: ProfileSchema,
});

// CV Store Schema
export const CVStoreSchema = z.object({
    cv: CVSchema,
    profile: ProfileSchema,
});

// Inferred Types
export type Social = z.infer<typeof SocialSchema>;
export type Technology = z.infer<typeof TechnologySchema>;
export type Role = z.infer<typeof RoleSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type AwardOrHonor = z.infer<typeof AwardOrHonorSchema>;
export type Publication = z.infer<typeof PublicationSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type CV = z.infer<typeof CVSchema>;
export type ComboboxItem = z.infer<typeof ComboboxItemSchema>;
export type Data = z.infer<typeof DataSchema>;