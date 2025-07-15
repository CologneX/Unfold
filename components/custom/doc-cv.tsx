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
import { PointerIcon } from "lucide-react";

Font.register({
  family: "Helvetica",
  src: "Helvetica",
});

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
  location: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 5,
    textAlign: "center",
  },
  contactInfo: {
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  profileDescription: {
    textAlign: "center",
    marginTop: 10,
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
  // Universal styles for all sections
  universalItemContainer: {
    marginBottom: 8,
  },
  universalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  title: {
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
  content: {
    marginBottom: 3,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  skillItem: {
    marginBottom: 3,
    fontSize: 9,
    marginRight: 8,
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
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  authors: {
    fontStyle: "italic",
    fontSize: 9,
  },
  dimmedText: {
    fontSize: 9,
    color: "#666666",
  },
  secondaryText: {
    fontSize: 10,
    color: "#555555",
  },
  // HTML rendering styles
  htmlText: {
    marginBottom: 3,
    textAlign: "justify",
  },
  htmlBold: {
    fontWeight: "bold",
  },
  htmlItalic: {
    fontStyle: "italic",
  },
  htmlUnderline: {
    textDecoration: "underline",
  },
  htmlListItem: {
    marginBottom: 2,
    paddingLeft: 8,
  },
  htmlParagraph: {
    marginBottom: 5,
    textAlign: "justify",
  },
});

// Helper function to strip HTML tags from rich text
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
};

const parseHtmlToReactPdf = (html: string): React.ReactNode[] => {
  if (!html) return [];

  // Clean up HTML and handle common entities
  let cleanHtml = html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const elements: React.ReactNode[] = [];
  let elementIndex = 0;

  // Helper function to parse text content with inline styling
  const parseInlineText = (
    text: string,
    baseStyle: any = {}
  ): React.ReactNode[] => {
    if (!text) return [];

    let processedText = text;
    const textElements: React.ReactNode[] = [];
    let textIndex = 0;

    // Remove any remaining HTML tags except inline formatting ones
    processedText = processedText.replace(
      /<(?!\/?(strong|b|em|i|u)\b)[^>]*>/gi,
      ""
    );

    // Handle bold text
    processedText = processedText.replace(
      /<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi,
      (match, openTag, content) => {
        const placeholder = `__BOLD_${textIndex}__`;
        textElements.push(
          <Text key={`bold-${textIndex}`} style={[baseStyle, styles.htmlBold]}>
            {content}
          </Text>
        );
        textIndex++;
        return placeholder;
      }
    );

    // Handle italic text
    processedText = processedText.replace(
      /<(em|i)[^>]*>(.*?)<\/(em|i)>/gi,
      (match, openTag, content) => {
        const placeholder = `__ITALIC_${textIndex}__`;
        textElements.push(
          <Text
            key={`italic-${textIndex}`}
            style={[baseStyle, styles.htmlItalic]}
          >
            {content}
          </Text>
        );
        textIndex++;
        return placeholder;
      }
    );

    // Handle underline text
    processedText = processedText.replace(
      /<u[^>]*>(.*?)<\/u>/gi,
      (match, content) => {
        const placeholder = `__UNDERLINE_${textIndex}__`;
        textElements.push(
          <Text
            key={`underline-${textIndex}`}
            style={[baseStyle, styles.htmlUnderline]}
          >
            {content}
          </Text>
        );
        textIndex++;
        return placeholder;
      }
    );

    // Split by placeholders and create final elements
    const segments = processedText.split(/(__(?:BOLD|ITALIC|UNDERLINE)_\d+__)/);
    const result: React.ReactNode[] = [];

    segments.forEach((segment, index) => {
      const placeholderMatch = segment.match(
        /__(?:BOLD|ITALIC|UNDERLINE)_(\d+)__/
      );
      if (placeholderMatch) {
        const partIdx = parseInt(placeholderMatch[1]);
        if (textElements[partIdx]) {
          result.push(textElements[partIdx]);
        }
      } else if (segment.trim()) {
        result.push(
          <Text key={`text-${index}`} style={baseStyle}>
            {segment}
          </Text>
        );
      }
    });

    return result.length > 0
      ? result
      : [
          <Text key="empty" style={baseStyle}>
            {text}
          </Text>,
        ];
  };

  // First, handle lists
  const listRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
  let listMatch;
  const processedRanges: Array<{ start: number; end: number }> = [];

  while ((listMatch = listRegex.exec(cleanHtml)) !== null) {
    const listContent = listMatch[1];
    const listItemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    const listItems: string[] = [];
    let itemMatch;

    while ((itemMatch = listItemRegex.exec(listContent)) !== null) {
      listItems.push(itemMatch[1].trim());
    }

    if (listItems.length > 0) {
      elements.push(
        <View key={`list-${elementIndex}`} style={{ marginBottom: 5 }}>
          {listItems.map((itemContent, itemIndex) => (
            <Text
              key={`list-item-${elementIndex}-${itemIndex}`}
              style={styles.htmlListItem}
            >
              • {parseInlineText(itemContent)}
            </Text>
          ))}
        </View>
      );
      elementIndex++;

      // Track this range as processed
      processedRanges.push({
        start: listMatch.index,
        end: listMatch.index + listMatch[0].length,
      });
    }
  }

  // Remove processed lists from the HTML
  processedRanges.reverse().forEach((range) => {
    cleanHtml = cleanHtml.slice(0, range.start) + cleanHtml.slice(range.end);
  });

  // Then handle paragraphs
  const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let paragraphMatch;
  let lastIndex = 0;

  while ((paragraphMatch = paragraphRegex.exec(cleanHtml)) !== null) {
    // Add any text before this paragraph
    if (paragraphMatch.index > lastIndex) {
      const beforeText = cleanHtml
        .slice(lastIndex, paragraphMatch.index)
        .trim();
      if (beforeText) {
        const cleanBeforeText = beforeText.replace(/<[^>]*>/g, "").trim();
        if (cleanBeforeText) {
          elements.push(
            <Text key={`before-${elementIndex}`} style={styles.htmlText}>
              {parseInlineText(cleanBeforeText)}
            </Text>
          );
          elementIndex++;
        }
      }
    }

    // Add the paragraph
    const paragraphContent = paragraphMatch[1].trim();
    if (paragraphContent) {
      elements.push(
        <Text key={`paragraph-${elementIndex}`} style={styles.htmlParagraph}>
          {parseInlineText(paragraphContent)}
        </Text>
      );
      elementIndex++;
    }

    lastIndex = paragraphRegex.lastIndex;
  }

  // Handle any remaining text after the last paragraph
  if (lastIndex < cleanHtml.length) {
    const remainingText = cleanHtml.slice(lastIndex).trim();
    if (remainingText) {
      const cleanRemainingText = remainingText.replace(/<[^>]*>/g, "").trim();
      if (cleanRemainingText) {
        elements.push(
          <Text key={`remaining-${elementIndex}`} style={styles.htmlText}>
            {parseInlineText(cleanRemainingText)}
          </Text>
        );
      }
    }
  }

  // If no structured content was found, treat as plain text
  if (elements.length === 0) {
    const plainText = cleanHtml.replace(/<[^>]*>/g, "").trim();
    if (plainText) {
      elements.push(
        <Text key="plain-text" style={styles.htmlText}>
          {parseInlineText(plainText)}
        </Text>
      );
    }
  }

  return elements;
};

// Join array of nodes with a dot
const joinNodesWithDot = (nodes: React.ReactNode[]) => {
  return nodes.map((node, index) => (
    <React.Fragment key={index}>
      {node}
      {index < nodes.length - 1 && <Text> • </Text>}
    </React.Fragment>
  ));
};

// CV Document Component
const CVDocument: React.FC<{ data: Data }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.profile.name}</Text>
        <Text style={styles.location}>{data.profile.location}</Text>
        <View style={styles.contactInfo}>
          <Text>
            {joinNodesWithDot(
              data.profile.socials.map((social) => (
                <Link key={social.id} style={styles.link} src={social.url}>
                  <Text>{social.name}</Text>
                </Link>
              ))
            )}
          </Text>
        </View>
        <Text style={styles.profileDescription}>
          {stripHtml(data.profile.description)}
        </Text>
      </View>

      {/* Professional Experience Section */}
      <View>
        <Text style={styles.sectionTitle}>Experience</Text>
        {data.cv.workExperiences
          .sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )
          .map((experience) => (
            <View key={experience.id} style={styles.universalItemContainer}>
              <View style={styles.universalHeader}>
                <Text style={styles.title}>{experience.name}</Text>
                <Text style={styles.dates}>
                  {formatDateToMonthYear(experience.startDate)} -{" "}
                  {experience.endDate
                    ? formatDateToMonthYear(experience.endDate)
                    : "Present"}
                </Text>
              </View>
              <View style={styles.description}>
                {parseHtmlToReactPdf(experience.description || "")}
              </View>
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
            <View key={education.id} style={styles.universalItemContainer}>
              <View style={styles.universalHeader}>
                <Text style={styles.title}>
                  {education.degree} in {education.name}
                </Text>
                <Text style={styles.dates}>
                  {education.endDate
                    ? formatDateToMonthYear(education.endDate)
                    : "Present"}
                </Text>
              </View>
              <Text style={styles.secondaryText}>{education.institution}</Text>
            </View>
          ))}
      </View>

      {/* Certifications Section */}
      {data.cv.certifications.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Certification</Text>
          {data.cv.certifications
            .sort(
              (a, b) =>
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime()
            )
            .map((cert) => (
              <View key={cert.id} style={styles.universalItemContainer}>
                <View style={styles.universalHeader}>
                  <Text style={styles.title}>{cert.name}</Text>
                  <Text style={styles.dates}>
                    {formatDateToMonthYear(cert.startDate)}
                    {cert.endDate
                      ? ` - ${formatDateToMonthYear(cert.endDate)}`
                      : " - Present"}
                  </Text>
                </View>
                <Text style={styles.secondaryText}>{cert.issuer}</Text>
                {cert.credentialId && (
                  <Text style={styles.dimmedText}>
                    Credential ID: {cert.credentialId}
                  </Text>
                )}
                {cert.url && (
                  <Link style={styles.link} src={cert.url}>
                    <Text>View Certificate</Text>
                  </Link>
                )}
              </View>
            ))}
        </View>
      )}

      {/* Projects Section */}
      {data.projects.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Project</Text>
          {data.projects
            .sort(
              (a, b) =>
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime()
            )
            .map((project) => (
              <View key={project.slug} style={styles.universalItemContainer}>
                <Text style={styles.title}>{project.name}</Text>
                <View style={styles.description}>
                  {parseHtmlToReactPdf(
                    project.description || project.shortDescription
                  )}
                </View>
                                  <View style={styles.skillsContainer}>
                    <Text style={[styles.authors, styles.secondaryText]}>Technologies: </Text>
                    <Text style={[styles.authors, styles.secondaryText]}>
                      {project.technologies.map((tech) => tech.name).join(", ")}
                    </Text>
                  </View>
                {(project.repositoryUrl || project.liveUrl) && (
                  <Text>
                    {joinNodesWithDot(
                      [
                        project.repositoryUrl && (
                          <Link
                            key="repo"
                            style={styles.link}
                            src={project.repositoryUrl}
                          >
                            <Text>View Repository</Text>
                          </Link>
                        ),
                        project.liveUrl && (
                          <Link
                            key="live"
                            style={styles.link}
                            src={project.liveUrl}
                          >
                            <Text>Live Demo</Text>
                          </Link>
                        ),
                      ].filter(Boolean)
                    )}
                  </Text>
                )}
              </View>
            ))}
        </View>
      )}

      {/* Publications Section */}
      {data.cv.publications.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Publication</Text>
          {data.cv.publications
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((publication) => (
              <View key={publication.id} style={styles.universalItemContainer}>
                <View style={styles.universalHeader}>
                  <Text style={styles.title}>{publication.title}</Text>
                  <Text style={styles.dates}>
                    {formatDateToMonthYear(publication.date)}
                  </Text>
                </View>
                <Text style={[styles.authors, styles.secondaryText]}>
                  {publication.authors.join(", ")}
                </Text>
                {publication.url && (
                  <Link style={styles.link} src={publication.url}>
                    <Text>View Publication</Text>{" "}
                    <Text>
                      <PointerIcon />
                    </Text>
                  </Link>
                )}
              </View>
            ))}
        </View>
      )}

      {/* Awards and Honors Section */}
      {data.cv.awardOrHonors.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Award & Honor</Text>
          {data.cv.awardOrHonors
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((award) => (
              <View key={award.id} style={styles.universalItemContainer}>
                <View style={styles.universalHeader}>
                  <Text style={styles.title}>{award.name}</Text>
                  <Text style={styles.dates}>
                    {formatDateToMonthYear(award.date)}
                  </Text>
                </View>
                <Text style={styles.secondaryText}>{award.institution}</Text>
                {award.description && (
                  <Text style={styles.description}>{award.description}</Text>
                )}
                {award.url && (
                  <Link style={styles.link} src={award.url}>
                    <Text>View Details</Text>
                  </Link>
                )}
              </View>
            ))}
        </View>
      )}

      {/* Languages Section */}
      {data.cv.languages.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Language</Text>
          {data.cv.languages.map((language) => (
            <View key={language.id} style={styles.universalItemContainer}>
              <View style={styles.universalHeader}>
                <Text style={styles.title}>{language.name}</Text>
                <Text style={styles.secondaryText}>
                  {language.proficiency}{" "}
                  {language.level ? `(${language.level})` : ""}
                </Text>
              </View>
              {language.url && (
                <Link style={styles.link} src={language.url}>
                  <Text>View Certificate</Text>
                </Link>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Roles/Expertise Areas */}
      {data.cv.roles.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Role / Expertise Area</Text>
          <View style={styles.dotContainer}>
            {joinNodesWithDot(
              data.cv.roles.map((role) => (
                <Text key={role.name} style={styles.skillItem}>
                  {role.name}
                </Text>
              ))
            )}
          </View>
        </View>
      )}

      {/* Technical Skills Section */}
      <View>
        <Text style={styles.sectionTitle}>Technical Skill</Text>
        <View style={styles.dotContainer}>
          {joinNodesWithDot(
            data.cv.technologies.map((tech) => (
              <Text key={tech.name} style={styles.skillItem}>
                {tech.name}
              </Text>
            ))
          )}
        </View>
      </View>
    </Page>
  </Document>
);

export default CVDocument;
