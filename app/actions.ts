'use server'

import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { revalidatePath } from 'next/cache'
import {
    profileSchema,
    projectSchema,
    socialSchema,
    technologySchema,
    roleSchema,
    workExperienceSchema,
    educationSchema,
    certificationSchema,
    awardOrHonorSchema,
    publicationSchema,
    languageSchema,
    type Profile,
    type Project,
    type Social,
    type Technology,
    type Role,
    type WorkExperience,
    type Education,
    type Certification,
    type AwardOrHonor,
    type Publication,
    type Language,
    Data,
    cvStoreSchema
} from '@/types/types'
import { generateSlug } from '@/lib/utils'
import { mkdir } from 'fs/promises'

const DATA_FILE = join(process.cwd(), 'data.json')

// Helper function to generate unique slug for projects
async function generateUniqueSlug(name: string, data: Data, excludeSlug?: string): Promise<string> {
    const baseSlug = generateSlug(name)
    let slug = baseSlug
    let counter = 1

    while (data.projects.some(p => p.slug === slug && p.slug !== excludeSlug)) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    return slug
}

// Helper function to read data from JSON file
async function readData(): Promise<Data> {
    try {
        const fileContent = await readFile(DATA_FILE, 'utf-8')
        return JSON.parse(fileContent)
    } catch (error) {
        throw new Error(`Failed to read data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// Helper function to write data to JSON file
async function writeData(data: Data): Promise<void> {
    try {
        await writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    } catch (error) {
        throw new Error(`Failed to write data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// IMAGE UPLOAD ACTION
export async function uploadImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        const file = formData.get('file') as File

        if (!file) {
            return { success: false, error: 'No file provided' }
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            return { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF files are allowed.' }
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return { success: false, error: 'File size too large. Maximum size is 5MB.' }
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads')
        try {
            await mkdir(uploadsDir, { recursive: true })
        } catch (error) {
            console.error('Failed to create uploads directory:', error)
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 15)
        const extension = file.name.split('.').pop()
        const filename = `${timestamp}-${randomStr}.${extension}`

        // Save file to public/uploads directory
        const filepath = join(uploadsDir, filename)
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        await writeFile(filepath, buffer)

        // Return the public URL
        const publicUrl = `/uploads/${filename}`

        return { success: true, url: publicUrl }
    } catch (error) {
        console.error('File upload error:', error)
        return {
            success: false,
            error: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
    }
}

// PROFILE ACTIONS
export async function readProfile(): Promise<Profile | null> {
    try {
        const data = await readData()
        return data.profile
    } catch (error) {
        throw new Error(`Failed to read profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateProfile(formData: FormData) {
    try {
        const rawData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            profilePictureUrl: formData.get('profilePictureUrl') as string,
            location: formData.get('location') as string,
            socials: JSON.parse(formData.get('socials') as string || '[]'),
        }

        const validatedFields = profileSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${validatedFields.error.flatten().fieldErrors}`)
        }

        const data = await readData()
        data.profile = validatedFields.data
        await writeData(data)

        revalidatePath('/profile')
        return { success: true, message: 'Profile updated successfully' }
    } catch (error) {
        throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// PROJECT ACTIONS
export async function createProject(formData: FormData) {
    try {
        const name = formData.get('name') as string
        const data = await readData()
        const slug = await generateUniqueSlug(name, data)

        const rawData = {
            slug,
            name,
            description: formData.get('description') as string,
            shortDescription: formData.get('shortDescription') as string,
            bannerUrl: formData.get('bannerUrl') as string || undefined,
            imageUrl: JSON.parse(formData.get('imageUrl') as string || '[]'),
            technologies: JSON.parse(formData.get('technologies') as string || '[]'),
            role: JSON.parse(formData.get('role') as string || '[]'),
            repositoryUrl: formData.get('repositoryUrl') as string || undefined,
            liveUrl: formData.get('liveUrl') as string || undefined,
            isFeatured: formData.get('isFeatured') === 'true',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const validatedFields = projectSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        data.projects.push(validatedFields.data)
        await writeData(data)

        revalidatePath('/projects')
        return slug
    } catch (error) {
        throw new Error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateProject(formData: FormData) {
    try {
        const slug = formData.get('slug') as string
        if (!slug) {
            throw new Error('Project slug is required')
        }

        const rawData = {
            slug,
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            shortDescription: formData.get('shortDescription') as string,
            bannerUrl: formData.get('bannerUrl') as string || undefined,
            imageUrl: JSON.parse(formData.get('imageUrl') as string || '[]'),
            technologies: JSON.parse(formData.get('technologies') as string || '[]'),
            role: JSON.parse(formData.get('role') as string || '[]'),
            repositoryUrl: formData.get('repositoryUrl') as string || undefined,
            liveUrl: formData.get('liveUrl') as string || undefined,
            isFeatured: formData.get('isFeatured') === 'true',
            updatedAt: new Date(),
        }

        const validatedFields = projectSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        const projectIndex = data.projects.findIndex(p => p.slug === slug)

        if (projectIndex === -1) {
            throw new Error(`Project with slug "${slug}" not found`)
        }

        // Preserve original createdAt
        const originalProject = data.projects[projectIndex]
        data.projects[projectIndex] = {
            ...validatedFields.data,
            createdAt: originalProject.createdAt
        }

        await writeData(data)

        revalidatePath('/projects')
        return { success: true, message: 'Project updated successfully', slug: validatedFields.data.slug }
    } catch (error) {
        throw new Error(`Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function readProject(slug: string): Promise<Project | null> {
    try {
        const data = await readData()
        const project = data.projects.find(p => p.slug === slug)
        return project || null
    } catch (error) {
        throw new Error(`Failed to read project: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function listProjects(): Promise<Project[]> {
    try {
        const data = await readData()
        return data.projects.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
            return 0
        })
    } catch (error) {
        throw new Error(`Failed to list projects: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteProject(formData: FormData) {
    try {
        const slug = formData.get('slug') as string
        if (!slug) {
            throw new Error('Project slug is required')
        }

        const data = await readData()
        const projectIndex = data.projects.findIndex(p => p.slug === slug)

        if (projectIndex === -1) {
            throw new Error(`Project with slug "${slug}" not found`)
        }

        data.projects.splice(projectIndex, 1)
        await writeData(data)

        revalidatePath('/projects')
    } catch (error) {
        throw new Error(`Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// CV ACTIONS
export async function readCV(): Promise<Data | null> {
    try {
        const data = await readData()
        return data
    } catch (error) {
        throw new Error(`Failed to read CV: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateCV(cv: Data) {
    try {
        const validatedFields = cvStoreSchema.safeParse(cv)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        await writeData({ ...data, ...validatedFields.data })

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'CV updated successfully' }
    } catch (error) {
        throw new Error(`Failed to update CV: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// SOCIAL ACTIONS (List, Create, Delete - No Update)
export async function listSocials(): Promise<Social[]> {
    try {
        const data = await readData()
        return data.profile.socials
    } catch (error) {
        throw new Error(`Failed to list socials: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function createSocial(formData: FormData) {
    try {
        const rawData = {
            id: crypto.randomUUID(),
            name: formData.get('name') as string,
            url: formData.get('url') as string,
        }

        const validatedFields = socialSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        data.profile.socials.push(validatedFields.data)
        await writeData(data)

        revalidatePath('/profile')
        return { success: true, message: 'Social added successfully' }
    } catch (error) {
        throw new Error(`Failed to create social: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteSocial(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Social id is required')
        }

        const data = await readData()
        const socialIndex = data.profile.socials.findIndex(s => s.id === id)

        if (socialIndex === -1) {
            throw new Error(`Social with id "${id}" not found`)
        }

        data.profile.socials.splice(socialIndex, 1)
        await writeData(data)

        revalidatePath('/profile')
        return { success: true, message: 'Social deleted successfully' }
    } catch (error) {
        throw new Error(`Failed to delete social: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// TECHNOLOGY ACTIONS (List, Create, Delete - No Update)
export async function listTechnologies(): Promise<Technology[]> {
    try {
        const data = await readData()
        return data.cv.technologies
    } catch (error) {
        throw new Error(`Failed to list technologies: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function createTechnology(formData: FormData) {
    try {
        const rawData = {
            name: formData.get('name') as string,
        }

        const validatedFields = technologySchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()

        // Check if technology with same name already exists
        const existingTechnology = data.cv.technologies.find(t => t.name === validatedFields.data.name)
        if (existingTechnology) {
            throw new Error(`Technology with name "${validatedFields.data.name}" already exists`)
        }

        data.cv.technologies.push(validatedFields.data)
        await writeData(data)

        revalidatePath('/admin/technologies')
        return { success: true, message: 'Technology added successfully' }
    } catch (error) {
        throw new Error(`Failed to create technology: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteTechnology(formData: FormData) {
    try {
        const name = formData.get('name') as string
        if (!name) {
            throw new Error('Technology name is required')
        }

        const data = await readData()
        const technologyIndex = data.cv.technologies.findIndex(t => t.name === name)

        if (technologyIndex === -1) {
            throw new Error(`Technology with name "${name}" not found`)
        }

        data.cv.technologies.splice(technologyIndex, 1)
        await writeData(data)

        revalidatePath('/admin/technologies')
        return { success: true, message: 'Technology deleted successfully' }
    } catch (error) {
        throw new Error(`Failed to delete technology: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// ROLE ACTIONS (List, Create, Delete - No Update)
export async function listRoles(): Promise<Role[]> {
    try {
        const data = await readData()
        return data.cv.roles
    } catch (error) {
        throw new Error(`Failed to list roles: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function createRole(formData: FormData) {
    try {
        const rawData = {
            name: formData.get('name') as string,
        }

        const validatedFields = roleSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()

        // Check if role with same name already exists
        const existingRole = data.cv.roles.find(r => r.name === validatedFields.data.name)
        if (existingRole) {
            throw new Error(`Role with name "${validatedFields.data.name}" already exists`)
        }

        data.cv.roles.push(validatedFields.data)
        await writeData(data)

        revalidatePath('/admin/roles')
        return { success: true, message: 'Role added successfully' }
    } catch (error) {
        throw new Error(`Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteRole(formData: FormData) {
    try {
        const name = formData.get('name') as string
        if (!name) {
            throw new Error('Role name is required')
        }

        const data = await readData()
        const roleIndex = data.cv.roles.findIndex(r => r.name === name)

        if (roleIndex === -1) {
            throw new Error(`Role with name "${name}" not found`)
        }

        data.cv.roles.splice(roleIndex, 1)
        await writeData(data)

        revalidatePath('/admin/roles')
        return { success: true, message: 'Role deleted successfully' }
    } catch (error) {
        throw new Error(`Failed to delete role: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// WORK EXPERIENCE ACTIONS (List, Create, Update, Delete)
export async function listWorkExperiences(): Promise<WorkExperience[]> {
    try {
        const data = await readData()
        return data.cv.workExperiences.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    } catch (error) {
        throw new Error(`Failed to list work experiences: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function createWorkExperience(formData: FormData) {
    try {
        const rawData = {
            id: crypto.randomUUID(),
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            startDate: new Date(formData.get('startDate') as string),
            endDate: new Date(formData.get('endDate') as string),
        }

        const validatedFields = workExperienceSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        data.cv.workExperiences.push(validatedFields.data)
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Work experience added successfully' }
    } catch (error) {
        throw new Error(`Failed to create work experience: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateWorkExperience(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Work experience id is required')
        }

        const rawData = {
            id,
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            startDate: new Date(formData.get('startDate') as string),
            endDate: new Date(formData.get('endDate') as string),
        }

        const validatedFields = workExperienceSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        const workExperienceIndex = data.cv.workExperiences.findIndex(w => w.id === id)

        if (workExperienceIndex === -1) {
            throw new Error(`Work experience with id "${id}" not found`)
        }

        data.cv.workExperiences[workExperienceIndex] = validatedFields.data
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Work experience updated successfully' }
    } catch (error) {
        throw new Error(`Failed to update work experience: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteWorkExperience(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Work experience id is required')
        }

        const data = await readData()
        const workExperienceIndex = data.cv.workExperiences.findIndex(w => w.id === id)

        if (workExperienceIndex === -1) {
            throw new Error(`Work experience with id "${id}" not found`)
        }

        data.cv.workExperiences.splice(workExperienceIndex, 1)
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Work experience deleted successfully' }
    } catch (error) {
        throw new Error(`Failed to delete work experience: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// EDUCATION ACTIONS (List, Create, Update, Delete)
export async function listEducations(): Promise<Education[]> {
    try {
        const data = await readData()
        return data.cv.educations.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    } catch (error) {
        throw new Error(`Failed to list educations: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function createEducation(formData: FormData) {
    try {
        const rawData = {
            id: crypto.randomUUID(),
            name: formData.get('name') as string,
            institution: formData.get('institution') as string,
            degree: formData.get('degree') as string,
            startDate: new Date(formData.get('startDate') as string),
            endDate: new Date(formData.get('endDate') as string),
        }

        const validatedFields = educationSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        data.cv.educations.push(validatedFields.data)
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Education added successfully' }
    } catch (error) {
        throw new Error(`Failed to create education: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateEducation(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Education id is required')
        }

        const rawData = {
            id,
            name: formData.get('name') as string,
            institution: formData.get('institution') as string,
            degree: formData.get('degree') as string,
            startDate: new Date(formData.get('startDate') as string),
            endDate: new Date(formData.get('endDate') as string),
        }

        const validatedFields = educationSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        const educationIndex = data.cv.educations.findIndex(e => e.id === id)

        if (educationIndex === -1) {
            throw new Error(`Education with id "${id}" not found`)
        }

        data.cv.educations[educationIndex] = validatedFields.data
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Education updated successfully' }
    } catch (error) {
        throw new Error(`Failed to update education: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteEducation(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Education id is required')
        }

        const data = await readData()
        const educationIndex = data.cv.educations.findIndex(e => e.id === id)

        if (educationIndex === -1) {
            throw new Error(`Education with id "${id}" not found`)
        }

        data.cv.educations.splice(educationIndex, 1)
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Education deleted successfully' }
    } catch (error) {
        throw new Error(`Failed to delete education: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// CERTIFICATION ACTIONS (List, Create, Update, Delete)
export async function listCertifications(): Promise<Certification[]> {
    try {
        const data = await readData()
        return data.cv.certifications.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    } catch (error) {
        throw new Error(`Failed to list certifications: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function createCertification(formData: FormData) {
    try {
        const rawData = {
            id: crypto.randomUUID(),
            name: formData.get('name') as string,
            issuer: formData.get('issuer') as string,
            startDate: new Date(formData.get('startDate') as string),
            endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
            credentialId: formData.get('credentialId') as string || undefined,
            url: formData.get('url') as string || undefined,
        }

        const validatedFields = certificationSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        data.cv.certifications.push(validatedFields.data)
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Certification added successfully' }
    } catch (error) {
        throw new Error(`Failed to create certification: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateCertification(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Certification id is required')
        }

        const rawData = {
            id,
            name: formData.get('name') as string,
            issuer: formData.get('issuer') as string,
            startDate: new Date(formData.get('startDate') as string),
            endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
            credentialId: formData.get('credentialId') as string || undefined,
            url: formData.get('url') as string || undefined,
        }

        const validatedFields = certificationSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        const certificationIndex = data.cv.certifications.findIndex(c => c.id === id)

        if (certificationIndex === -1) {
            throw new Error(`Certification with id "${id}" not found`)
        }

        data.cv.certifications[certificationIndex] = validatedFields.data
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Certification updated successfully' }
    } catch (error) {
        throw new Error(`Failed to update certification: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteCertification(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Certification id is required')
        }

        const data = await readData()
        const certificationIndex = data.cv.certifications.findIndex(c => c.id === id)

        if (certificationIndex === -1) {
            throw new Error(`Certification with id "${id}" not found`)
        }

        data.cv.certifications.splice(certificationIndex, 1)
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Certification deleted successfully' }
    } catch (error) {
        throw new Error(`Failed to delete certification: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// AWARD OR HONOR ACTIONS (List, Create, Update, Delete)
export async function listAwardOrHonors(): Promise<AwardOrHonor[]> {
    try {
        const data = await readData()
        return data.cv.awardOrHonors.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (error) {
        throw new Error(`Failed to list awards or honors: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function createAwardOrHonor(formData: FormData) {
    try {
        const rawData = {
            id: crypto.randomUUID(),
            name: formData.get('name') as string,
            institution: formData.get('institution') as string,
            description: formData.get('description') as string || undefined,
            date: new Date(formData.get('date') as string),
            url: formData.get('url') as string || undefined,
        }

        const validatedFields = awardOrHonorSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        data.cv.awardOrHonors.push(validatedFields.data)
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Award or honor added successfully' }
    } catch (error) {
        throw new Error(`Failed to create award or honor: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateAwardOrHonor(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Award or honor id is required')
        }

        const rawData = {
            id,
            name: formData.get('name') as string,
            institution: formData.get('institution') as string,
            description: formData.get('description') as string || undefined,
            date: new Date(formData.get('date') as string),
            url: formData.get('url') as string || undefined,
        }

        const validatedFields = awardOrHonorSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        const awardOrHonorIndex = data.cv.awardOrHonors.findIndex(a => a.id === id)

        if (awardOrHonorIndex === -1) {
            throw new Error(`Award or honor with id "${id}" not found`)
        }

        data.cv.awardOrHonors[awardOrHonorIndex] = validatedFields.data
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Award or honor updated successfully' }
    } catch (error) {
        throw new Error(`Failed to update award or honor: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteAwardOrHonor(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Award or honor id is required')
        }

        const data = await readData()
        const awardOrHonorIndex = data.cv.awardOrHonors.findIndex(a => a.id === id)

        if (awardOrHonorIndex === -1) {
            throw new Error(`Award or honor with id "${id}" not found`)
        }

        data.cv.awardOrHonors.splice(awardOrHonorIndex, 1)
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Award or honor deleted successfully' }
    } catch (error) {
        throw new Error(`Failed to delete award or honor: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// PUBLICATION ACTIONS (List, Create, Update, Delete)
export async function listPublications(): Promise<Publication[]> {
    try {
        const data = await readData()
        return data.cv.publications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (error) {
        throw new Error(`Failed to list publications: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function createPublication(formData: FormData) {
    try {
        const rawData = {
            id: crypto.randomUUID(),
            title: formData.get('title') as string,
            authors: JSON.parse(formData.get('authors') as string || '[]'),
            date: new Date(formData.get('date') as string),
            url: formData.get('url') as string || undefined,
        }

        const validatedFields = publicationSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        data.cv.publications.push(validatedFields.data)
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Publication added successfully' }
    } catch (error) {
        throw new Error(`Failed to create publication: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updatePublication(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Publication id is required')
        }

        const rawData = {
            id,
            title: formData.get('title') as string,
            authors: JSON.parse(formData.get('authors') as string || '[]'),
            date: new Date(formData.get('date') as string),
            url: formData.get('url') as string || undefined,
        }

        const validatedFields = publicationSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        const publicationIndex = data.cv.publications.findIndex(p => p.id === id)

        if (publicationIndex === -1) {
            throw new Error(`Publication with id "${id}" not found`)
        }

        data.cv.publications[publicationIndex] = validatedFields.data
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Publication updated successfully' }
    } catch (error) {
        throw new Error(`Failed to update publication: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deletePublication(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Publication id is required')
        }

        const data = await readData()
        const publicationIndex = data.cv.publications.findIndex(p => p.id === id)

        if (publicationIndex === -1) {
            throw new Error(`Publication with id "${id}" not found`)
        }

        data.cv.publications.splice(publicationIndex, 1)
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Publication deleted successfully' }
    } catch (error) {
        throw new Error(`Failed to delete publication: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// LANGUAGE ACTIONS (List, Create, Update, Delete)
export async function listLanguages(): Promise<Language[]> {
    try {
        const data = await readData()
        return data.cv.languages
    } catch (error) {
        throw new Error(`Failed to list languages: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function createLanguage(formData: FormData) {
    try {
        const rawData = {
            id: crypto.randomUUID(),
            name: formData.get('name') as string,
            proficiency: formData.get('proficiency') as "Beginner" | "Intermediate" | "Advanced" | "Fluent" | "Native",
            level: formData.get('level') as "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | undefined,
            url: formData.get('url') as string || undefined,
        }

        const validatedFields = languageSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        data.cv.languages.push(validatedFields.data)
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Language added successfully' }
    } catch (error) {
        throw new Error(`Failed to create language: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateLanguage(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Language id is required')
        }

        const rawData = {
            id,
            name: formData.get('name') as string,
            proficiency: formData.get('proficiency') as "Beginner" | "Intermediate" | "Advanced" | "Fluent" | "Native",
            level: formData.get('level') as "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | undefined,
            url: formData.get('url') as string || undefined,
        }

        const validatedFields = languageSchema.safeParse(rawData)

        if (!validatedFields.success) {
            throw new Error(`Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
        }

        const data = await readData()
        const languageIndex = data.cv.languages.findIndex(l => l.id === id)

        if (languageIndex === -1) {
            throw new Error(`Language with id "${id}" not found`)
        }

        data.cv.languages[languageIndex] = validatedFields.data
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Language updated successfully' }
    } catch (error) {
        throw new Error(`Failed to update language: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteLanguage(formData: FormData) {
    try {
        const id = formData.get('id') as string
        if (!id) {
            throw new Error('Language id is required')
        }

        const data = await readData()
        const languageIndex = data.cv.languages.findIndex(l => l.id === id)

        if (languageIndex === -1) {
            throw new Error(`Language with id "${id}" not found`)
        }

        data.cv.languages.splice(languageIndex, 1)
        await writeData(data)

        revalidatePath('/curriculum-vitae')
        return { success: true, message: 'Language deleted successfully' }
    } catch (error) {
        throw new Error(`Failed to delete language: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// PROJECT TECHNOLOGIES AND ROLES EXTRACTION
export async function getProjectTechnologiesAndRoles(): Promise<{
    technologies: Technology[]
    roles: Role[]
}> {
    try {
        const data = await readData()

        // Extract all technologies from all projects
        const allTechnologies = data.projects.flatMap(project => project.technologies)

        // Extract all roles from all projects
        const allRoles = data.projects.flatMap(project => project.role)

        // Remove duplicates based on name
        const uniqueTechnologies = allTechnologies.filter((tech, index, array) =>
            array.findIndex(t => t.name === tech.name) === index
        )

        const uniqueRoles = allRoles.filter((role, index, array) =>
            array.findIndex(r => r.name === role.name) === index
        )

        return {
            technologies: uniqueTechnologies,
            roles: uniqueRoles
        }
    } catch (error) {
        throw new Error(`Failed to get project technologies and roles: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}
