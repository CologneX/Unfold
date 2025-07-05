import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";
import { Data } from "@/types/types";
import { formatDateToMonthYear } from "@/lib/utils";

// Register fonts for better ATS compatibility
Font.register({
  family: "Helvetica",
  src: "Helvetica",
});

// ATS-friendly styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    borderBottom: "1pt solid #000000",
    paddingBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    textTransform: "uppercase",
  },
  contactInfo: {
    textAlign: "center",
    marginBottom: 10,
  },
  profileDescription: {
    textAlign: "justify",
    marginTop: 10,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 15,
    marginBottom: 8,
    borderBottom: "0.5pt solid #000000",
    paddingBottom: 2,
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: "bold",
  },
  dates: {
    fontSize: 9,
    fontStyle: "italic",
  },
  description: {
    textAlign: "justify",
    marginTop: 2,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillItem: {
    marginRight: 8,
    marginBottom: 3,
    fontSize: 9,
  },
  listItem: {
    marginBottom: 5,
    paddingLeft: 5,
  },
  link: {
    color: "#0066CC",
    textDecoration: "none",
  },
  twocolumn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    width: "48%",
  },
  educationItem: {
    marginBottom: 8,
  },
  degreeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
    marginBottom: 2,
  },
  certificationItem: {
    marginBottom: 6,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  publicationTitle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  authors: {
    fontStyle: "italic",
    fontSize: 9,
  },
  awardItem: {
    marginBottom: 8,
  },
  awardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
    marginBottom: 2,
  },
});

// Helper function to strip HTML tags from rich text
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
};

// CV Document Component
const CVDocument: React.FC<{ data: Data }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.profile.name}</Text>
        <View style={styles.contactInfo}>
          <Text>{data.profile.location}</Text>
          {data.profile.socials.map((social) => (
            <Link key={social.id} style={styles.link} src={social.url}>
              <Text>
                {social.name}: {social.url}
              </Text>
            </Link>
          ))}
        </View>
        <Text style={styles.profileDescription}>
          {stripHtml(data.profile.description)}
        </Text>
      </View>

      {/* Technical Skills Section */}
      <View>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <View style={styles.skillsContainer}>
          {data.cv.technologies.map((tech, index) => (
            <Text key={index} style={styles.skillItem}>
              {tech.name}
              {index < data.cv.technologies.length - 1 ? " •" : ""}
            </Text>
          ))}
        </View>
      </View>

      {/* Professional Experience Section */}
      <View>
        <Text style={styles.sectionTitle}>Professional Experience</Text>
        {data.cv.workExperiences
          .sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )
          .map((experience) => (
            <View key={experience.id} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <Text style={styles.jobTitle}>{experience.name}</Text>
                <Text style={styles.dates}>
                  {formatDateToMonthYear(experience.startDate)} -{" "}
                  {experience.endDate
                    ? formatDateToMonthYear(experience.endDate)
                    : "Present"}
                </Text>
              </View>
              <Text style={styles.description}>
                {stripHtml(experience.description || "")}
              </Text>
            </View>
          ))}
      </View>

      {/* Education Section */}
      <View>
        <Text style={styles.sectionTitle}>Education</Text>
        {data.cv.educations
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
          .map((education) => (
            <View key={education.id} style={styles.educationItem}>
              <View style={styles.degreeInfo}>
                <Text>
                  {education.degree} in {education.name}
                </Text>
                <Text style={styles.dates}>
                  {education.endDate
                    ? formatDateToMonthYear(education.endDate)
                    : "Present"}
                </Text>
              </View>
              <Text>{education.institution}</Text>
            </View>
          ))}
      </View>

      {/* Certifications Section */}
      {data.cv.certifications.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {data.cv.certifications
            .sort(
              (a, b) =>
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime()
            )
            .map((cert) => (
              <View key={cert.id} style={styles.certificationItem}>
                <Text style={styles.jobTitle}>{cert.name}</Text>
                <Text>
                  {cert.issuer} • {formatDateToMonthYear(cert.startDate)}
                  {cert.endDate
                    ? ` - ${formatDateToMonthYear(cert.endDate)}`
                    : " - Present"}
                </Text>
                {cert.credentialId && (
                  <Text>Credential ID: {cert.credentialId}</Text>
                )}
                {cert.url && (
                  <Link style={styles.link} src={cert.url}>
                    <Text>Verification: {cert.url}</Text>
                  </Link>
                )}
              </View>
            ))}
        </View>
      )}

      {/* Key Projects Section */}
      {data.projects.filter((p) => p.isFeatured).length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Key Projects</Text>
          {data.projects
            .filter((project) => project.isFeatured)
            .sort(
              (a, b) =>
                new Date(b.updatedAt || b.createdAt || 0).getTime() -
                new Date(a.updatedAt || a.createdAt || 0).getTime()
            )
            .map((project) => (
              <View key={project.slug} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{project.name}</Text>
                <Text style={styles.description}>
                  {stripHtml(project.shortDescription)}
                </Text>
                <View style={styles.skillsContainer}>
                  <Text style={styles.skillItem}>Technologies: </Text>
                  {project.technologies.map((tech, index) => (
                    <Text key={index} style={styles.skillItem}>
                      {tech.name}
                      {index < project.technologies.length - 1 ? ", " : ""}
                    </Text>
                  ))}
                </View>
                {project.repositoryUrl && (
                  <Link style={styles.link} src={project.repositoryUrl}>
                    <Text>Repository: {project.repositoryUrl}</Text>
                  </Link>
                )}
                {project.liveUrl && (
                  <Link style={styles.link} src={project.liveUrl}>
                    <Text>Live Demo: {project.liveUrl}</Text>
                  </Link>
                )}
              </View>
            ))}
        </View>
      )}

      {/* Publications Section */}
      {data.cv.publications.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Publications</Text>
          {data.cv.publications
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((publication) => (
              <View key={publication.id} style={styles.listItem}>
                <Text style={styles.publicationTitle}>{publication.title}</Text>
                <Text style={styles.authors}>
                  {publication.authors.join(", ")} •{" "}
                  {formatDateToMonthYear(publication.date)}
                </Text>
                {publication.url && (
                  <Link style={styles.link} src={publication.url}>
                    <Text>{publication.url}</Text>
                  </Link>
                )}
              </View>
            ))}
        </View>
      )}

      {/* Awards and Honors Section */}
      {data.cv.awardOrHonors.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Awards & Honors</Text>
          {data.cv.awardOrHonors
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((award) => (
              <View key={award.id} style={styles.awardItem}>
                <View style={styles.awardHeader}>
                  <Text>{award.name}</Text>
                  <Text style={styles.dates}>
                    {formatDateToMonthYear(award.date)}
                  </Text>
                </View>
                <Text>{award.institution}</Text>
                {award.description && (
                  <Text style={styles.description}>{award.description}</Text>
                )}
                {award.url && (
                  <Link style={styles.link} src={award.url}>
                    <Text>{award.url}</Text>
                  </Link>
                )}
              </View>
            ))}
        </View>
      )}

      {/* Languages Section */}
      {data.cv.languages.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Languages</Text>
          {data.cv.languages.map((language) => (
            <View key={language.id} style={styles.languageItem}>
              <Text>{language.name}</Text>
              <Text>
                {language.proficiency}{" "}
                {language.level ? `(${language.level})` : ""}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Roles/Expertise Areas */}
      {data.cv.roles.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Areas of Expertise</Text>
          <View style={styles.skillsContainer}>
            {data.cv.roles.map((role, index) => (
              <Text key={index} style={styles.skillItem}>
                {role.name}
                {index < data.cv.roles.length - 1 ? " • " : ""}
              </Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  </Document>
);

export default CVDocument;
