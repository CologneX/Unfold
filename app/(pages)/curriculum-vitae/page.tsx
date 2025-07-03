import {
  getProjectTechnologiesAndRoles,
  listProjects,
  readCV,
  readProfile,
  listSocials,
} from "@/app/actions";
import {
  AwardOrHonor,
  Certification,
  Education,
  Language,
  Profile,
  Project,
  Publication,
  Role,
  Social,
  Technology,
  WorkExperience,
} from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  Globe,
  ExternalLink,
  Languages,
  Code,
  UserCheck,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";

export default async function CurriculumVitae() {
  try {
    const [CV, profile, socials, technologiesAndRoles, projects] =
      await Promise.all([
        readCV(),
        readProfile(),
        listSocials(),
        getProjectTechnologiesAndRoles(),
        listProjects(),
      ]);

    if (!CV || !profile) {
      throw new Error("No profile data found.");
    }

    return (
      <div className="space-y-8 mt-4">
        {/* Profile Header */}
        <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl">
          {/* Animated border gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 p-[1px] rounded-lg">
            <div className="h-full w-full bg-card/90 backdrop-blur-xl rounded-lg" />
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full animate-ping" />
            <div className="absolute top-8 right-12 w-1 h-1 bg-primary/20 rounded-full animate-pulse delay-500" />
            <div className="absolute top-12 right-6 w-1.5 h-1.5 bg-primary/25 rounded-full animate-pulse delay-1000" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.02]" />
          <CardContent className="relative p-8 z-10">
            <CVProfileSection profile={profile} />
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <CVSocialSection socials={socials || []} />
            <CVTechnologySection
              technologies={technologiesAndRoles?.technologies || []}
            />
            <CVRoleSection roles={technologiesAndRoles?.roles || []} />
            <CVLanguageSection languages={CV.cv.languages} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <CVWorkExperienceSection workExperiences={CV.cv.workExperiences} />
            <CVEducationSection educations={CV.cv.educations} />
            <CVProjectSection projects={projects} />
            <CVCertificationSection certifications={CV.cv.certifications} />
            <CVAwardOrHonorSection awardOrHonors={CV.cv.awardOrHonors} />
            <CVPublicationSection publications={CV.cv.publications} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("UNKNOWN_ERROR");
  }
}

function CVProfileSection({ profile }: { profile: Profile }) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
      <div className="relative group">
        {/* Animated ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

        {/* Profile image */}
        <div className="relative h-36 w-36 rounded-full overflow-hidden ring-2 ring-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <Image
            src={profile.profilePictureUrl || "/placeholder.jpg"}
            alt={profile.name}
            width={2000}
            height={2000}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Sparkle effects */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="absolute top-2 right-2 h-4 w-4 text-primary/60 animate-pulse" />
            <Star className="absolute bottom-3 left-3 h-3 w-3 text-primary/40 animate-pulse delay-500" />
          </div>
        </div>
      </div>

      <div className="flex-1 text-center md:text-left space-y-4">
        <div className="space-y-3">
          {/* Animated name with gradient */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent animate-in slide-in-from-left-5 duration-700">
            {profile.name}
          </h1>

          {/* Location with enhanced styling */}
          <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground group/location">
            <div className="relative">
              <MapPin className="h-4 w-4 transition-colors group-hover/location:text-primary" />
              <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover/location:scale-150 transition-transform duration-300 -z-10" />
            </div>
            <span className="text-sm font-medium group-hover/location:text-foreground transition-colors">
              {profile.location}
            </span>
          </div>
        </div>

        {/* Enhanced description */}
        <div className="relative">
          <p className="text-muted-foreground leading-relaxed max-w-2xl text-lg animate-in slide-in-from-right-5 duration-700 delay-200">
            {profile.description}
          </p>

          {/* Decorative line */}
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent rounded-full hidden md:block" />
        </div>
      </div>
    </div>
  );
}

function CVSocialSection({ socials }: { socials: Social[] }) {
  if (!socials?.length) return null;

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group/card">
      {/* Animated border */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-lg group/title">
          <div className="relative">
            <Globe className="h-5 w-5 text-primary transition-transform group-hover/title:rotate-12 duration-300" />
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover/title:scale-150 transition-transform duration-300 -z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Contact
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 relative z-10">
        {socials.map((social, index) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/30 transition-all group/social border border-transparent hover:border-primary/20 animate-in slide-in-from-left-3 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-sm font-medium group-hover/social:text-primary transition-colors">
              {social.name}
            </span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover/social:text-primary group-hover/social:translate-x-1 transition-all duration-300" />
          </a>
        ))}
      </CardContent>
    </Card>
  );
}

function CVTechnologySection({ technologies }: { technologies: Technology[] }) {
  if (!technologies?.length) return null;

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group/card">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-lg group/title">
          <div className="relative">
            <Code className="h-5 w-5 text-primary transition-transform group-hover/title:scale-110 duration-300" />
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover/title:scale-150 transition-transform duration-300 -z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Technologies
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <Badge
              key={tech.name}
              variant="secondary"
              className="text-xs hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all cursor-default animate-in fade-in-0 zoom-in-95 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {tech.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CVRoleSection({ roles }: { roles: Role[] }) {
  if (!roles?.length) return null;

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group/card">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 via-transparent to-primary/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-lg group/title">
          <div className="relative">
            <UserCheck className="h-5 w-5 text-primary transition-transform group-hover/title:scale-110 duration-300" />
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover/title:scale-150 transition-transform duration-300 -z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Roles
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex flex-wrap gap-2">
          {roles.map((role, index) => (
            <Badge
              key={role.name}
              variant="outline"
              className="text-xs hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all  cursor-default animate-in fade-in-0 zoom-in-95 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {role.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CVLanguageSection({ languages }: { languages: Language[] }) {
  if (!languages?.length) return null;

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group/card">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/4 via-transparent to-primary/6 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-lg group/title">
          <div className="relative">
            <Languages className="h-5 w-5 text-primary transition-transform group-hover/title:rotate-6 duration-300" />
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover/title:scale-150 transition-transform duration-300 -z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Languages
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        {languages.map((language, index) => (
          <div
            key={language.id}
            className="space-y-3 p-3 rounded-lg hover:bg-accent/20 transition-all border border-transparent hover:border-primary/20 group/lang animate-in slide-in-from-left-3 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm group-hover/lang:text-primary transition-colors duration-300">
                {language.name}
              </span>
              <span className="text-xs text-muted-foreground group-hover/lang:text-foreground/80 transition-colors duration-300 px-2 py-1 rounded-full bg-accent/30">
                {language.proficiency}
              </span>
            </div>
            <div className="flex items-center justify-between">
              {language.level && (
                <Badge
                  variant="outline"
                  className="text-xs hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all duration-300"
                >
                  {language.level}
                </Badge>
              )}
              {language.url && (
                <a
                  href={language.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-all duration-300 group/link hover:translate-x-1"
                >
                  <span className="font-medium">Certificate</span>
                  <ExternalLink className="h-3 w-3 group-hover/link:rotate-12 transition-transform duration-300" />
                </a>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CVWorkExperienceSection({
  workExperiences,
}: {
  workExperiences: WorkExperience[];
}) {
  if (!workExperiences?.length) return null;

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 group/card">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

      {/* Floating decoration */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl group/title">
          <div className="relative">
            <Briefcase className="h-6 w-6 text-primary transition-all duration-300 group-hover/title:rotate-12 group-hover/title:scale-110" />
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover/title:scale-150 transition-transform duration-300 -z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Work Experience
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 relative z-10">
        {workExperiences.map((experience, index) => (
          <div key={experience.id} className="group/item">
            {index > 0 && <Separator className="mb-8 opacity-50" />}
            <div
              className="space-y-4 p-4 rounded-lg hover:bg-accent/20 transition-all border border-transparent hover:border-primary/20 animate-in slide-in-from-bottom-3 duration-700"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-8 top-2 w-3 h-3 bg-primary/30 rounded-full border-2 border-primary/50 group-hover/item:bg-primary group-hover/item:border-primary transition-all duration-300">
                  <div className="absolute inset-0 bg-primary/50 rounded-full animate-ping opacity-0 group-hover/item:opacity-75" />
                </div>

                <h3 className="font-semibold text-lg group-hover/item:text-primary transition-colors duration-300">
                  {experience.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 group/date">
                  <Calendar className="h-4 w-4 transition-colors group-hover/date:text-primary" />
                  <span className="group-hover/date:text-foreground transition-colors">
                    {new Date(experience.startDate).toLocaleDateString()} -{" "}
                    {new Date(experience.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="relative">
                <p className="text-muted-foreground leading-relaxed group-hover/item:text-foreground/90 transition-colors duration-300">
                  {experience.description}
                </p>
                {/* Decorative accent */}
                <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CVEducationSection({ educations }: { educations: Education[] }) {
  if (!educations?.length) return null;

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 group/card">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-primary/4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

      {/* Floating decoration */}
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl group/title">
          <div className="relative">
            <GraduationCap className="h-6 w-6 text-primary transition-all duration-300 group-hover/title:rotate-12 group-hover/title:scale-110" />
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover/title:scale-150 transition-transform duration-300 -z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Education
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 relative z-10">
        {educations.map((education, index) => (
          <div key={education.id} className="group/item">
            {index > 0 && <Separator className="mb-8 opacity-50" />}
            <div
              className="space-y-4 p-4 rounded-lg hover:bg-accent/20 transition-all  border border-transparent hover:border-primary/20 animate-in slide-in-from-bottom-3 duration-700"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-8 top-2 w-3 h-3 bg-primary/30 rounded-full border-2 border-primary/50 group-hover/item:bg-primary group-hover/item:border-primary transition-all duration-300">
                  <div className="absolute inset-0 bg-primary/50 rounded-full animate-ping opacity-0 group-hover/item:opacity-75" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg group-hover/item:text-primary transition-colors duration-300">
                    {education.degree}
                  </h3>
                  <p className="text-foreground font-medium group-hover/item:text-primary/80 transition-colors duration-300">
                    {education.name}
                  </p>
                  <p className="text-sm text-muted-foreground group-hover/item:text-foreground/70 transition-colors duration-300">
                    {education.institution}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 group/date">
                  <Calendar className="h-4 w-4 transition-colors group-hover/date:text-primary" />
                  <span className="group-hover/date:text-foreground transition-colors">
                    {new Date(education.startDate).toLocaleDateString()} -{" "}
                    {new Date(education.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CVProjectSection({ projects }: { projects: Project[] }) {
  if (!projects?.length) return null;

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 group/card">
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/2 via-transparent to-primary/4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-primary/30 rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary/15 rounded-full animate-pulse delay-1000" />
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl group/title">
          <div className="relative">
            <Code className="h-6 w-6 text-primary transition-all duration-300 group-hover/title:rotate-6 group-hover/title:scale-110" />
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover/title:scale-150 transition-transform duration-300 -z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Projects
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 relative z-10">
        {projects.slice(0, 6).map((project, index) => (
          <div key={project.slug} className="group/project">
            {index > 0 && <Separator className="mb-8 opacity-50" />}
            <div
              className="space-y-4 p-4 rounded-xl hover:bg-accent/20 transition-all  border border-transparent hover:border-primary/20 hover:shadow-lg animate-in slide-in-from-bottom-3 duration-700"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative">
                {/* Project indicator */}
                <div className="absolute -left-6 top-1 w-2 h-2 bg-primary/40 rounded-full group-hover/project:bg-primary group-hover/project:scale-125 transition-all duration-300">
                  <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping opacity-0 group-hover/project:opacity-100" />
                </div>

                <h3 className="font-semibold text-lg group-hover/project:text-primary transition-colors duration-300 mb-2">
                  {project.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed group-hover/project:text-foreground/80 transition-colors duration-300">
                  {project.shortDescription}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <Badge
                    key={tech.name}
                    variant="secondary"
                    className="text-xs hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all  cursor-default animate-in fade-in-0 zoom-in-95 duration-500"
                    style={{
                      animationDelay: `${index * 150 + techIndex * 50}ms`,
                    }}
                  >
                    {tech.name}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-6">
                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-all duration-300 group/link hover:translate-x-1"
                  >
                    <span className="font-medium">Repository</span>
                    <ExternalLink className="h-3 w-3 group-hover/link:rotate-12 transition-transform duration-300" />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-all duration-300 group/link hover:translate-x-1"
                  >
                    <span className="font-medium">Live Demo</span>
                    <ExternalLink className="h-3 w-3 group-hover/link:rotate-12 transition-transform duration-300" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CVCertificationSection({
  certifications,
}: {
  certifications: Certification[];
}) {
  if (!certifications?.length) return null;

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 group/card">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/3 via-transparent to-primary/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

      {/* Floating decoration */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl group/title">
          <div className="relative">
            <Award className="h-6 w-6 text-primary transition-all duration-300 group-hover/title:rotate-12 group-hover/title:scale-110" />
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover/title:scale-150 transition-transform duration-300 -z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Certifications
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 relative z-10">
        {certifications.map((certification, index) => (
          <div key={certification.id} className="group/item">
            {index > 0 && <Separator className="mb-8 opacity-50" />}
            <div
              className="space-y-4 p-4 rounded-lg hover:bg-accent/20 transition-all  border border-transparent hover:border-primary/20 animate-in slide-in-from-bottom-3 duration-700"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-8 top-2 w-3 h-3 bg-primary/30 rounded-full border-2 border-primary/50 group-hover/item:bg-primary group-hover/item:border-primary transition-all duration-300">
                  <div className="absolute inset-0 bg-primary/50 rounded-full animate-ping opacity-0 group-hover/item:opacity-75" />
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg group-hover/item:text-primary transition-colors duration-300">
                      {certification.name}
                    </h3>
                    <p className="text-foreground font-medium group-hover/item:text-primary/80 transition-colors duration-300">
                      {certification.issuer}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground group/date">
                    <Calendar className="h-4 w-4 transition-colors group-hover/date:text-primary" />
                    <span className="group-hover/date:text-foreground transition-colors">
                      {new Date(certification.startDate).toLocaleDateString()}
                      {certification.endDate &&
                        ` - ${new Date(
                          certification.endDate
                        ).toLocaleDateString()}`}
                    </span>
                  </div>

                  {certification.credentialId && (
                    <p className="text-sm text-muted-foreground group-hover/item:text-foreground/70 transition-colors duration-300 px-3 py-1 bg-accent/20 rounded-md inline-block">
                      ID: {certification.credentialId}
                    </p>
                  )}

                  {certification.url && (
                    <a
                      href={certification.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-all duration-300 group/link hover:translate-x-1"
                    >
                      <span className="font-medium">View Certificate</span>
                      <ExternalLink className="h-3 w-3 group-hover/link:rotate-12 transition-transform duration-300" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CVAwardOrHonorSection({
  awardOrHonors,
}: {
  awardOrHonors: AwardOrHonor[];
}) {
  if (!awardOrHonors?.length) return null;

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 group/card">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/4 via-transparent to-primary/6 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

      {/* Floating decoration */}
      <div className="absolute bottom-4 right-4 w-28 h-28 bg-primary/8 rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl group/title">
          <div className="relative">
            <Award className="h-6 w-6 text-primary transition-all duration-300 group-hover/title:rotate-12 group-hover/title:scale-110" />
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover/title:scale-150 transition-transform duration-300 -z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Awards & Honors
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 relative z-10">
        {awardOrHonors.map((award, index) => (
          <div key={award.id} className="group/item">
            {index > 0 && <Separator className="mb-8 opacity-50" />}
            <div
              className="space-y-4 p-4 rounded-lg hover:bg-accent/20 transition-all  border border-transparent hover:border-primary/20 animate-in slide-in-from-bottom-3 duration-700"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-8 top-2 w-3 h-3 bg-primary/30 rounded-full border-2 border-primary/50 group-hover/item:bg-primary group-hover/item:border-primary transition-all duration-300">
                  <div className="absolute inset-0 bg-primary/50 rounded-full animate-ping opacity-0 group-hover/item:opacity-75" />
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg group-hover/item:text-primary transition-colors duration-300">
                      {award.name}
                    </h3>
                    <p className="text-foreground font-medium group-hover/item:text-primary/80 transition-colors duration-300">
                      {award.institution}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground group/date">
                    <Calendar className="h-4 w-4 transition-colors group-hover/date:text-primary" />
                    <span className="group-hover/date:text-foreground transition-colors">
                      {new Date(award.date).toLocaleDateString()}
                    </span>
                  </div>

                  {award.description && (
                    <div className="relative">
                      <p className="text-muted-foreground text-sm leading-relaxed group-hover/item:text-foreground/80 transition-colors duration-300">
                        {award.description}
                      </p>
                      {/* Decorative accent */}
                      <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  {award.url && (
                    <a
                      href={award.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-all duration-300 group/link hover:translate-x-1"
                    >
                      <span className="font-medium">View Award</span>
                      <ExternalLink className="h-3 w-3 group-hover/link:rotate-12 transition-transform duration-300" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CVPublicationSection({
  publications,
}: {
  publications: Publication[];
}) {
  if (!publications?.length) return null;

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 group/card">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-primary/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

      {/* Floating decoration */}
      <div className="absolute top-1/3 left-4 w-16 h-16 bg-primary/6 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl group/title">
          <div className="relative">
            <BookOpen className="h-6 w-6 text-primary transition-all duration-300 group-hover/title:rotate-6 group-hover/title:scale-110" />
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover/title:scale-150 transition-transform duration-300 -z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Publications
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 relative z-10">
        {publications.map((publication, index) => (
          <div key={publication.id} className="group/item">
            {index > 0 && <Separator className="mb-8 opacity-50" />}
            <div
              className="space-y-4 p-4 rounded-lg hover:bg-accent/20 transition-all  border border-transparent hover:border-primary/20 animate-in slide-in-from-bottom-3 duration-700"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-8 top-2 w-3 h-3 bg-primary/30 rounded-full border-2 border-primary/50 group-hover/item:bg-primary group-hover/item:border-primary transition-all duration-300">
                  <div className="absolute inset-0 bg-primary/50 rounded-full animate-ping opacity-0 group-hover/item:opacity-75" />
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg group-hover/item:text-primary transition-colors duration-300">
                    {publication.title}
                  </h3>

                  <p className="text-sm text-muted-foreground group-hover/item:text-foreground/70 transition-colors duration-300 italic">
                    Authors: {publication.authors.join(", ")}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground group/date">
                    <Calendar className="h-4 w-4 transition-colors group-hover/date:text-primary" />
                    <span className="group-hover/date:text-foreground transition-colors">
                      Published:{" "}
                      {new Date(publication.date).toLocaleDateString()}
                    </span>
                  </div>

                  {publication.url && (
                    <a
                      href={publication.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-all duration-300 group/link hover:translate-x-1"
                    >
                      <span className="font-medium">View Publication</span>
                      <ExternalLink className="h-3 w-3 group-hover/link:rotate-12 transition-transform duration-300" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
