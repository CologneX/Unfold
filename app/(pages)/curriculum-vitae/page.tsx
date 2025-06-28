import {
  getProjectTechnologiesAndRoles,
  listProjects,
  readCV,
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
import FloatingButton from "../../../components/custom/floating-button";

export default async function CurriculumVitae() {
  try {
    const [CV, technologiesAndRoles, projects] = await Promise.all([
      readCV(),
      getProjectTechnologiesAndRoles(),
      listProjects(),
    ]);

    if (!CV) {
      throw new Error("No profile data found.");
    }

    return (
      <div className="relative h-full py-8 px-4 max-w-4xl mx-auto">
        <FloatingButton />
        {/* CV Header with gradient border */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-sm"></div>
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-xl">
            {/* <CVSection delay={0}> */}
            <CVProfileSection profile={CV.profile} />
            {/* </CVSection> */}
          </div>
        </div>

        {/* CV Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact & Social */}
            {/* <CVSection delay={100}> */}
            <CVSocialSection socials={CV?.socials || []} />
            {/* </CVSection> */}

            {/* Skills & Technologies */}
            {/* <CVSection delay={200}> */}
            <CVTechnologySection
              technologies={technologiesAndRoles?.technologies || []}
            />
            {/* </CVSection> */}

            {/* Roles */}
            {/* <CVSection delay={300}> */}
            <CVRoleSection roles={technologiesAndRoles?.roles || []} />
            {/* </CVSection> */}

            {/* Languages */}
            {/* <CVSection delay={400}> */}
            <CVLanguageSection languages={CV.languages} />
            {/* </CVSection> */}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Work Experience */}
            {/* <CVSection delay={500}> */}
            <CVWorkExperienceSection workExperiences={CV.workExperiences} />
            {/* </CVSection> */}

            {/* Education */}
            {/* <CVSection delay={600}> */}
            <CVEducationSection educations={CV.educations} />
            {/* </CVSection> */}

            {/* Projects */}
            {/* <CVSection delay={700}> */}
            <CVProjectSection projects={projects} />
            {/* </CVSection> */}

            {/* Certifications */}
            {/* <CVSection delay={800}> */}
            <CVCertificationSection certifications={CV.certifications} />
            {/* </CVSection> */}

            {/* Awards & Honors */}
            {/* <CVSection delay={900}> */}
            <CVAwardOrHonorSection awardOrHonors={CV.awardOrHonors} />
            {/* </CVSection> */}

            {/* Publications */}
            {/* <CVSection delay={1000}> */}
            <CVPublicationSection publications={CV.publications} />
            {/* </CVSection> */}
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
    <div className="text-center">
      <div className="relative inline-block mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-md opacity-75"></div>
        <img
          src={profile.profilePictureUrl || "/placeholder.jpg"}
          alt={profile.name}
          className="relative w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
        />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.name}</h1>
      <p className="text-lg text-gray-600 mb-2">{profile.location}</p>
      <p className="text-gray-700 leading-relaxed">{profile.description}</p>
    </div>
  );
}

function CVSocialSection({ socials }: { socials: Social[] }) {
  if (!socials?.length) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
        Contact
      </h2>
      <div className="space-y-3">
        {socials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <span className="font-medium">{social.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function CVTechnologySection({ technologies }: { technologies: Technology[] }) {
  if (!technologies?.length) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3"></div>
        Technologies
      </h2>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech.name}
            className="px-3 py-1 bg-gradient-to-r from-blue-100/50 to-purple-100/50 backdrop-blur-sm border border-white/30 rounded-full text-sm text-gray-700 shadow-sm"
          >
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function CVRoleSection({ roles }: { roles: Role[] }) {
  if (!roles?.length) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-blue-600 rounded-full mr-3"></div>
        Roles
      </h2>
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <span
            key={role.name}
            className="px-3 py-1 bg-gradient-to-r from-green-100/50 to-blue-100/50 backdrop-blur-sm border border-white/30 rounded-full text-sm text-gray-700 shadow-sm"
          >
            {role.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function CVLanguageSection({ languages }: { languages: Language[] }) {
  if (!languages?.length) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <div className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-full mr-3"></div>
        Languages
      </h2>
      <div className="space-y-3">
        {languages.map((language) => (
          <div key={language.id} className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">{language.name}</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {language.proficiency}
              </span>
              {language.level && (
                <span className="px-2 py-1 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 backdrop-blur-sm border border-white/30 rounded text-xs text-gray-600">
                  {language.level}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CVWorkExperienceSection({
  workExperiences,
}: {
  workExperiences: WorkExperience[];
}) {
  if (!workExperiences?.length) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
        Work Experience
      </h2>
      <div className="space-y-6">
        {workExperiences.map((experience) => (
          <div
            key={experience.id}
            className="border-l-2 border-blue-200/50 pl-4 pb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {experience.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(experience.startDate).toLocaleDateString()} -{" "}
              {new Date(experience.endDate).toLocaleDateString()}
            </p>
            <p className="text-gray-700">{experience.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CVEducationSection({ educations }: { educations: Education[] }) {
  if (!educations?.length) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-600 rounded-full mr-3"></div>
        Education
      </h2>
      <div className="space-y-6">
        {educations.map((education) => (
          <div
            key={education.id}
            className="border-l-2 border-green-200/50 pl-4 pb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {education.degree}
            </h3>
            <p className="text-md text-gray-800">{education.name}</p>
            <p className="text-sm text-gray-600 mb-2">
              {education.institution}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(education.startDate).toLocaleDateString()} -{" "}
              {new Date(education.endDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CVProjectSection({ projects }: { projects: Project[] }) {
  if (!projects?.length) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3"></div>
        Projects
      </h2>
      <div className="space-y-6">
        {projects.slice(0, 6).map((project) => (
          <div
            key={project.slug}
            className="border-l-2 border-purple-200/50 pl-4 pb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {project.name}
            </h3>
            <p className="text-gray-700 mb-3">{project.shortDescription}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.technologies.map((tech) => (
                <span
                  key={tech.name}
                  className="px-2 py-1 bg-gradient-to-r from-purple-100/50 to-pink-100/50 backdrop-blur-sm border border-white/30 rounded text-xs text-gray-600"
                >
                  {tech.name}
                </span>
              ))}
            </div>
            <div className="flex space-x-4 text-sm">
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Repository
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 transition-colors"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CVCertificationSection({
  certifications,
}: {
  certifications: Certification[];
}) {
  if (!certifications?.length) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <div className="w-1 h-8 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-full mr-3"></div>
        Certifications
      </h2>
      <div className="space-y-6">
        {certifications.map((certification) => (
          <div
            key={certification.id}
            className="border-l-2 border-yellow-200/50 pl-4 pb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {certification.name}
            </h3>
            <p className="text-md text-gray-800">{certification.issuer}</p>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(certification.startDate).toLocaleDateString()}
              {certification.endDate &&
                ` - ${new Date(certification.endDate).toLocaleDateString()}`}
            </p>
            {certification.credentialId && (
              <p className="text-sm text-gray-600">
                ID: {certification.credentialId}
              </p>
            )}
            {certification.url && (
              <a
                href={certification.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
              >
                View Certificate
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CVAwardOrHonorSection({
  awardOrHonors,
}: {
  awardOrHonors: AwardOrHonor[];
}) {
  if (!awardOrHonors?.length) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-orange-600 rounded-full mr-3"></div>
        Awards & Honors
      </h2>
      <div className="space-y-6">
        {awardOrHonors.map((award) => (
          <div
            key={award.id}
            className="border-l-2 border-red-200/50 pl-4 pb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {award.name}
            </h3>
            <p className="text-md text-gray-800">{award.institution}</p>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(award.date).toLocaleDateString()}
            </p>
            {award.description && (
              <p className="text-gray-700 mb-2">{award.description}</p>
            )}
            {award.url && (
              <a
                href={award.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
              >
                View Award
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CVPublicationSection({
  publications,
}: {
  publications: Publication[];
}) {
  if (!publications?.length) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-3"></div>
        Publications
      </h2>
      <div className="space-y-6">
        {publications.map((publication) => (
          <div
            key={publication.id}
            className="border-l-2 border-indigo-200/50 pl-4 pb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {publication.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Authors: {publication.authors.join(", ")}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Published: {new Date(publication.date).toLocaleDateString()}
            </p>
            {publication.url && (
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
              >
                View Publication
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
