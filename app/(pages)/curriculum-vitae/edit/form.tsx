"use client";

import { useState, useCallback, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Languages,
  Shield,
  Network,
  Plus,
  Save,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { CusFormField, ModernFieldGrid } from "./form-field";
import { CusFormSection, ModernFormItem } from "./form-section";
import { CVSection } from "./cv-section";
import ImageUpload from "@/components/custom/image-upload";
import BadgeCombobox from "@/components/custom/badge-combobox";
import DatePicker from "@/components/custom/date-picker";
import { SelectResponsive } from "@/components/custom/res-select";

import {
  cvSchema,
  type CV,
  type ComboboxItem,
  type Technology,
  type Role,
  Social,
  Profile,
} from "@/types/types";
import {
  updateCV,
  createTechnology,
  createRole,
  updateProfile,
  createSocial,
  deleteSocial,
} from "@/app/actions";
import { cn } from "@/lib/utils";

interface CurriculumVitaeEditFormProps {
  CV: CV | null;
  availableTechnologies: Technology[];
  availableRoles: Role[];
  socials: Social[];
  profile: Profile | null;
}

const formSteps = [
  {
    id: "experience",
    title: "Experience",
    description: "Work history and roles",
    icon: Briefcase,
  },
  {
    id: "education",
    title: "Education",
    description: "Academic background",
    icon: GraduationCap,
  },
  {
    id: "skills",
    title: "Skills",
    description: "Technologies and expertise",
    icon: Network,
  },
  {
    id: "achievements",
    title: "Achievements",
    description: "Awards, certifications, publications",
    icon: Award,
  },
  {
    id: "languages",
    title: "Languages",
    description: "Language proficiency",
    icon: Languages,
  },
];

export default function CurriculumVitaeEditForm({
  CV,
  availableTechnologies,
  availableRoles,
  socials,
  profile,
}: CurriculumVitaeEditFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CV>({
    resolver: zodResolver(cvSchema),
    defaultValues: CV || {
  technologies: [],
  roles: [],
  workExperiences: [],
  educations: [],
  certifications: [],
  awardOrHonors: [],
  publications: [],
  languages: [],
    },
  });

  // Field arrays for array fields
  const {
    fields: workFields,
    append: addWork,
    remove: removeWork,
  } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  const {
    fields: educationFields,
    append: addEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  const {
    fields: certificationFields,
    append: addCertification,
    remove: removeCertification,
  } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  const {
    fields: awardFields,
    append: addAward,
    remove: removeAward,
  } = useFieldArray({
    control: form.control,
    name: "awardOrHonors",
  });

  const {
    fields: publicationFields,
    append: addPublication,
    remove: removePublication,
  } = useFieldArray({
    control: form.control,
    name: "publications",
  });

  const {
    fields: languageFields,
    append: addLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  // Convert arrays to combobox format
  const technologyOptions: ComboboxItem[] = availableTechnologies.map(
    (tech) => ({
      value: tech.name,
      label: tech.name,
    })
  );

  const roleOptions: ComboboxItem[] = availableRoles.map((role) => ({
    value: role.name,
    label: role.name,
  }));

  // Handle technology and role additions
  const handleAddTechnology = useCallback(async (item: ComboboxItem) => {
        const formData = new FormData();
        formData.append("name", item.label);
        await createTechnology(formData);
    }, []);

  const handleAddRole = useCallback(async (item: ComboboxItem) => {
        const formData = new FormData();
        formData.append("name", item.label);
        await createRole(formData);
  }, []);

  // Form submission
  const onSubmit = useCallback((data: CV) => {
    startTransition(async () => {
      try {
        await updateCV(data);
        toast.success("CV updated successfully!");
      } catch (error) {
        toast.error(
          `Failed to update CV: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    });
    }, []);

  // Navigation helpers
  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const goToStep = (step: number) => setCurrentStep(step);

  // Calculate progress
  const progress = ((currentStep + 1) / formSteps.length) * 100;
    return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-background/50 border rounded-md mt-4">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edit CV</h1>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {formSteps.length}:{" "}
                {formSteps[currentStep].description}
              </p>
            </div>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2 h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save CV
                </>
              )}
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="w-full bg-border/40 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step navigation */}
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
            {formSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <motion.button
                  key={step.id}
                  type="button"
                  onClick={() => goToStep(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : isCompleted
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "bg-card text-muted-foreground hover:bg-card/80"
                  )}
                >
                  <StepIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{step.title}</span>
                  {isCompleted && <CheckCircle2 className="h-3 w-3" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profile and Socials Management */}
      <div className="bg-background/50 border rounded-md mb-6">
        <div className="container mx-auto p-6">
          <ProfileSocialsForms profile={profile} socials={socials} />
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="py-8 flex-1 flex flex-col justify-between"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Experience Step */}
              {currentStep === 0 && (
                <CVSection delay={0}>
                  <CusFormSection
                    title="Work Experience"
                    description="Your professional work history and achievements"
                    icon={<Briefcase className="h-5 w-5" />}
                    onAdd={() =>
                      addWork({
        id: crypto.randomUUID(),
        name: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
                      })
                    }
                    addLabel="Add Experience"
                  >
                    {workFields.map((field, index) => (
                      <ModernFormItem
                key={field.id}
                        onDelete={() => removeWork(index)}
                        title="Work Experience"
                        index={index}
                      >
                        <ModernFieldGrid cols={1}>
                <FormField
                  control={form.control}
                  name={`workExperiences.${index}.name`}
                  render={({ field }) => (
                              <CusFormField label="Position/Role">
                        <Input
                          {...field}
                                  placeholder="Senior Software Engineer"
                                />
                              </CusFormField>
                            )}
                          />
                        </ModernFieldGrid>

                        <ModernFieldGrid cols={2}>
                          <CusFormField label="Start Date">
                            <DatePicker
                              value={form.watch(
                                `workExperiences.${index}.startDate`
                              )}
                              onChange={(date: Date) =>
                                form.setValue(
                                  `workExperiences.${index}.startDate`,
                                  date || new Date()
                                )
                              }
                            />
                          </CusFormField>
                          <CusFormField label="End Date">
                          <DatePicker
                              value={form.watch(
                                `workExperiences.${index}.endDate`
                              )}
                              onChange={(date: Date) =>
                                form.setValue(
                                  `workExperiences.${index}.endDate`,
                                  date || new Date()
                                )
                              }
                            />
                          </CusFormField>
                        </ModernFieldGrid>

                  <FormField
                    control={form.control}
                          name={`workExperiences.${index}.description`}
                    render={({ field }) => (
                            <CusFormField
                              label="Description"
                              description="Describe your responsibilities, achievements, and impact"
                            >
                              <Textarea
                                {...field}
                                placeholder="Led a team of 5 engineers to develop..."
                                className="min-h-[100px] resize-none"
                              />
                            </CusFormField>
                          )}
                        />
                      </ModernFormItem>
                    ))}
                  </CusFormSection>
                </CVSection>
              )}

              {/* Education Step */}
              {currentStep === 1 && (
                <CVSection delay={0}>
                  <CusFormSection
                    title="Education"
                    description="Your academic background and qualifications"
                    icon={<GraduationCap className="h-5 w-5" />}
                    onAdd={() =>
                      addEducation({
        id: crypto.randomUUID(),
        name: "",
        institution: "",
        degree: "",
        startDate: new Date(),
        endDate: new Date(),
                      })
                    }
                    addLabel="Add Education"
                  >
                    {educationFields.map((field, index) => (
                      <ModernFormItem
                key={field.id}
                        onDelete={() => removeEducation(index)}
                        title="Education"
                        index={index}
                      >
                        <ModernFieldGrid cols={2}>
                <FormField
                  control={form.control}
                  name={`educations.${index}.name`}
                  render={({ field }) => (
                              <CusFormField label="Program/Course">
                                <Input
                                  {...field}
                                  placeholder="Computer Science"
                                />
                              </CusFormField>
                            )}
                          />
                <FormField
                  control={form.control}
                  name={`educations.${index}.institution`}
                  render={({ field }) => (
                              <CusFormField label="Institution">
                        <Input
                          {...field}
                                  placeholder="Stanford University"
                        />
                              </CusFormField>
                  )}
                />
                        </ModernFieldGrid>

                <FormField
                  control={form.control}
                  name={`educations.${index}.degree`}
                  render={({ field }) => (
                            <CusFormField label="Degree">
                              <Input
                                {...field}
                                placeholder="Bachelor of Science"
                              />
                            </CusFormField>
                          )}
                        />

                        <ModernFieldGrid cols={2}>
                          <CusFormField label="Start Date">
                          <DatePicker
                              value={form.watch(
                                `educations.${index}.startDate`
                              )}
                              onChange={(date: Date) =>
                                form.setValue(
                                  `educations.${index}.startDate`,
                                  date || new Date()
                                )
                              }
                            />
                          </CusFormField>
                          <CusFormField label="End Date">
                          <DatePicker
                              value={form.watch(`educations.${index}.endDate`)}
                              onChange={(date: Date) =>
                                form.setValue(
                                  `educations.${index}.endDate`,
                                  date || new Date()
                                )
                              }
                            />
                          </CusFormField>
                        </ModernFieldGrid>
                      </ModernFormItem>
                    ))}
                  </CusFormSection>
                </CVSection>
              )}

              {/* Skills Step */}
              {currentStep === 2 && (
                <CVSection delay={0}>
                  <div className="space-y-8">
                    <CusFormSection
                      title="Technologies"
                      description="Programming languages, frameworks, and tools you work with"
                      icon={<Network className="h-5 w-5" />}
                    >
                      <CusFormField label="Technologies & Tools">
                        <BadgeCombobox
                          value={form.watch("technologies").map((tech) => ({
                            value: tech.name,
                            label: tech.name,
                          }))}
                          data={technologyOptions}
                          onChange={(items) => {
                            form.setValue(
                              "technologies",
                              items.map((item) => ({ name: item.label }))
                            );
                          }}
                          onAddNew={handleAddTechnology}
                          placeholder="Select technologies..."
                          searchPlaceholder="Search technologies..."
                          emptyMessage="No technologies found. Type to add a new one."
                        />
                      </CusFormField>
                    </CusFormSection>

                    <CusFormSection
                      title="Roles & Expertise"
                      description="Your professional roles and areas of expertise"
                      icon={<Briefcase className="h-5 w-5" />}
                    >
                      <CusFormField label="Professional Roles">
                        <BadgeCombobox
                          value={form.watch("roles").map((role) => ({
                            value: role.name,
                            label: role.name,
                          }))}
                          data={roleOptions}
                          onChange={(items) => {
                            form.setValue(
                              "roles",
                              items.map((item) => ({ name: item.label }))
                            );
                          }}
                          onAddNew={handleAddRole}
                          placeholder="Select roles..."
                          searchPlaceholder="Search roles..."
                          emptyMessage="No roles found. Type to add a new one."
                        />
                      </CusFormField>
                    </CusFormSection>
                  </div>
                </CVSection>
              )}

              {/* Achievements Step */}
              {currentStep === 3 && (
                <CVSection delay={0}>
                  <div className="space-y-8">
                    {/* Certifications */}
                    <CusFormSection
                      title="Certifications"
                      description="Professional certifications and credentials"
                      icon={<Shield className="h-5 w-5" />}
                      onAdd={() =>
                        addCertification({
        id: crypto.randomUUID(),
        name: "",
        issuer: "",
        startDate: new Date(),
        endDate: undefined,
        credentialId: "",
        url: "",
                        })
                      }
                      addLabel="Add Certification"
                    >
                      {certificationFields.map((field, index) => (
                        <ModernFormItem
                key={field.id}
                          onDelete={() => removeCertification(index)}
                          title="Certification"
                          index={index}
                        >
                          <ModernFieldGrid cols={2}>
                <FormField
                  control={form.control}
                  name={`certifications.${index}.name`}
                  render={({ field }) => (
                                <CusFormField label="Certification Name">
                        <Input
                          {...field}
                                    placeholder="AWS Solutions Architect"
                        />
                                </CusFormField>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`certifications.${index}.issuer`}
                  render={({ field }) => (
                                <CusFormField label="Issuing Organization">
                                  <Input
                                    {...field}
                                    placeholder="Amazon Web Services"
                                  />
                                </CusFormField>
                              )}
                            />
                          </ModernFieldGrid>

                          <ModernFieldGrid cols={2}>
                            <CusFormField label="Issue Date">
                              <DatePicker
                                value={form.watch(
                                  `certifications.${index}.startDate`
                                )}
                                onChange={(date: Date) =>
                                  form.setValue(
                                    `certifications.${index}.startDate`,
                                    date || new Date()
                                  )
                                }
                              />
                            </CusFormField>
                            <CusFormField label="Expiry Date (Optional)">
                              <DatePicker
                                value={
                                  form.watch(
                                    `certifications.${index}.endDate`
                                  ) || new Date()
                                }
                                onChange={(date: Date) =>
                                  form.setValue(
                                    `certifications.${index}.endDate`,
                                    date
                                  )
                                }
                              />
                            </CusFormField>
                          </ModernFieldGrid>

                          <ModernFieldGrid cols={2}>
                <FormField
                  control={form.control}
                  name={`certifications.${index}.credentialId`}
                  render={({ field }) => (
                                <CusFormField label="Credential ID (Optional)">
                                  <Input {...field} placeholder="ABC123XYZ" />
                                </CusFormField>
                              )}
                            />
                <FormField
                  control={form.control}
                  name={`certifications.${index}.url`}
                  render={({ field }) => (
                                <CusFormField label="Verification URL (Optional)">
                        <Input
                          {...field}
                                    placeholder="https://verify.example.com"
                                  />
                                </CusFormField>
                              )}
                            />
                          </ModernFieldGrid>
                        </ModernFormItem>
                      ))}
                    </CusFormSection>

                    {/* Awards */}
                    <CusFormSection
                      title="Awards & Honors"
                      description="Recognition and achievements you've received"
                      icon={<Award className="h-5 w-5" />}
                      onAdd={() =>
                        addAward({
        id: crypto.randomUUID(),
        name: "",
        institution: "",
        description: "",
        date: new Date(),
        url: "",
                        })
                      }
                      addLabel="Add Award"
                    >
                      {awardFields.map((field, index) => (
                        <ModernFormItem
                key={field.id}
                          onDelete={() => removeAward(index)}
                          title="Award"
                          index={index}
                        >
                          <ModernFieldGrid cols={2}>
                <FormField
                  control={form.control}
                  name={`awardOrHonors.${index}.name`}
                  render={({ field }) => (
                                <CusFormField label="Award Name">
                                  <Input
                                    {...field}
                                    placeholder="Employee of the Year"
                                  />
                                </CusFormField>
                              )}
                            />
                <FormField
                  control={form.control}
                  name={`awardOrHonors.${index}.institution`}
                  render={({ field }) => (
                                <CusFormField label="Awarding Institution">
                        <Input
                          {...field}
                                    placeholder="Company Name"
                                  />
                                </CusFormField>
                              )}
                            />
                          </ModernFieldGrid>

                          <CusFormField label="Date Received">
                            <DatePicker
                              value={form.watch(`awardOrHonors.${index}.date`)}
                              onChange={(date: Date) =>
                                form.setValue(
                                  `awardOrHonors.${index}.date`,
                                  date || new Date()
                                )
                              }
                            />
                          </CusFormField>

                <FormField
                  control={form.control}
                  name={`awardOrHonors.${index}.description`}
                  render={({ field }) => (
                              <CusFormField
                                label="Description (Optional)"
                                description="Brief description of the award and why you received it"
                              >
                        <Textarea
                          {...field}
                                  placeholder="Recognized for outstanding performance..."
                                  className="min-h-[100px] resize-none"
                        />
                              </CusFormField>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`awardOrHonors.${index}.url`}
                  render={({ field }) => (
                              <CusFormField label="URL (Optional)">
                        <Input
                          {...field}
                                  placeholder="https://award.example.com"
                                />
                              </CusFormField>
                            )}
                          />
                        </ModernFormItem>
                      ))}
                    </CusFormSection>

                    {/* Publications */}
                    <CusFormSection
                      title="Publications"
                      description="Research papers, articles, and other publications"
                      icon={<BookOpen className="h-5 w-5" />}
                      onAdd={() =>
                        addPublication({
        id: crypto.randomUUID(),
        title: "",
        authors: [],
        date: new Date(),
        url: "",
                        })
                      }
                      addLabel="Add Publication"
                    >
                      {publicationFields.map((field, index) => (
                        <ModernFormItem
                key={field.id}
                          onDelete={() => removePublication(index)}
                          title="Publication"
                          index={index}
                        >
                <FormField
                  control={form.control}
                  name={`publications.${index}.title`}
                  render={({ field }) => (
                              <CusFormField label="Title">
                                <Input
                                  {...field}
                                  placeholder="A Study on Modern Web Development"
                                />
                              </CusFormField>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`publications.${index}.authors`}
                  render={({ field }) => (
                              <CusFormField
                                label="Authors"
                                description="Comma-separated list of authors"
                              >
                        <Input
                                  value={field.value?.join(", ") || ""}
                                  onChange={(e) => {
                                    const authors = e.target.value
                                      .split(",")
                                      .map((author) => author.trim())
                                      .filter(Boolean);
                                    field.onChange(authors);
                                  }}
                                  placeholder="John Doe, Jane Smith, Bob Johnson"
                                />
                              </CusFormField>
                            )}
                          />

                          <ModernFieldGrid cols={2}>
                            <CusFormField label="Publication Date">
                              <DatePicker
                                value={form.watch(`publications.${index}.date`)}
                                onChange={(date: Date) =>
                                  form.setValue(
                                    `publications.${index}.date`,
                                    date || new Date()
                                  )
                                }
                              />
                            </CusFormField>
                <FormField
                  control={form.control}
                  name={`publications.${index}.url`}
                  render={({ field }) => (
                                <CusFormField label="URL (Optional)">
                        <Input
                          {...field}
                                    placeholder="https://publication.example.com"
                                  />
                                </CusFormField>
                              )}
                            />
                          </ModernFieldGrid>
                        </ModernFormItem>
                      ))}
                    </CusFormSection>
                  </div>
                </CVSection>
              )}

              {/* Languages Step */}
              {currentStep === 4 && (
                <CVSection delay={0}>
                  <CusFormSection
                    title="Languages"
                    description="Languages you speak and your proficiency levels"
                    icon={<Languages className="h-5 w-5" />}
                    onAdd={() =>
                      addLanguage({
      id: crypto.randomUUID(),
      name: "",
      proficiency: "Beginner",
      level: undefined,
      url: "",
                      })
                    }
                    addLabel="Add Language"
                  >
                    {languageFields.map((field, index) => (
                      <ModernFormItem
              key={field.id}
                        onDelete={() => removeLanguage(index)}
                        title="Language"
                        index={index}
                      >
                        <ModernFieldGrid cols={2}>
              <FormField
                control={form.control}
                name={`languages.${index}.name`}
                render={({ field }) => (
                              <CusFormField label="Language">
                                <Input {...field} placeholder="English" />
                              </CusFormField>
                            )}
                          />
                <FormField
                  control={form.control}
                  name={`languages.${index}.proficiency`}
                  render={({ field }) => (
                              <CusFormField label="Proficiency Level">
                        <SelectResponsive
                                  value={field.value}
                                  onChange={field.onChange}
                                  options={[
                                    { value: "Beginner", label: "Beginner" },
                                    {
                                      value: "Intermediate",
                                      label: "Intermediate",
                                    },
                                    { value: "Advanced", label: "Advanced" },
                                    { value: "Fluent", label: "Fluent" },
                                    { value: "Native", label: "Native" },
                                  ]}
                                  placeholder="Select proficiency level"
                                />
                              </CusFormField>
                            )}
                          />
                        </ModernFieldGrid>

                        <ModernFieldGrid cols={2}>
                <FormField
                  control={form.control}
                  name={`languages.${index}.level`}
                  render={({ field }) => (
                              <CusFormField label="CEFR Level (Optional)">
                        <SelectResponsive
                          value={field.value || null}
                                  onChange={field.onChange}
                                  options={[
                                    { value: "A1", label: "A1 - Beginner" },
                                    { value: "A2", label: "A2 - Elementary" },
                                    { value: "B1", label: "B1 - Intermediate" },
                                    {
                                      value: "B2",
                                      label: "B2 - Upper Intermediate",
                                    },
                                    { value: "C1", label: "C1 - Advanced" },
                                    { value: "C2", label: "C2 - Proficient" },
                                  ]}
                                  placeholder="Select CEFR level"
                                />
                              </CusFormField>
                            )}
                          />
              <FormField
                control={form.control}
                name={`languages.${index}.url`}
                render={({ field }) => (
                              <CusFormField label="Certificate URL (Optional)">
                                <Input
                                  {...field}
                                  placeholder="https://certificate.example.com"
                                />
                              </CusFormField>
                            )}
                          />
                        </ModernFieldGrid>
                      </ModernFormItem>
                    ))}
                  </CusFormSection>
                </CVSection>
              )}
            </motion.div>
        </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-8">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={prevStep}
              icon={ChevronLeft}
              iconPlacement="left"
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {formSteps.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToStep(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-200",
                    index === currentStep
                      ? "bg-primary w-8"
                      : index < currentStep
                      ? "bg-primary/60"
                      : "bg-border"
                  )}
                />
              ))}
            </div>

            <Button
              type="button"
              size="sm"
              onClick={nextStep}
              disabled={currentStep === formSteps.length - 1}
              icon={ChevronRight}
              iconPlacement="right"
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Profile and Socials Management Component
function ProfileSocialsForms({
  profile,
  socials,
}: {
  profile: Profile | null;
  socials: Social[];
}) {
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isSocialsEditing, setIsSocialsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleUpdateProfile = useCallback((formData: FormData) => {
    startTransition(async () => {
      try {
        await updateProfile(formData);
        toast.success("Profile updated successfully!");
        setIsProfileEditing(false);
      } catch (error) {
        toast.error(
          `Failed to update profile: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    });
  }, []);

  const handleCreateSocial = useCallback((formData: FormData) => {
    startTransition(async () => {
      try {
        await createSocial(formData);
        toast.success("Social link added successfully!");
      } catch (error) {
        toast.error(
          `Failed to add social link: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    });
  }, []);

  const handleDeleteSocial = useCallback((formData: FormData) => {
    startTransition(async () => {
      try {
        await deleteSocial(formData);
        toast.success("Social link deleted successfully!");
      } catch (error) {
        toast.error(
          `Failed to delete social link: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Profile & Social Links</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Manage your profile information and social media links separately from
          your CV content.
        </p>
      </div>

      {/* Profile Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Profile Information</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsProfileEditing(!isProfileEditing)}
          >
            {isProfileEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        {profile && !isProfileEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-card rounded-lg">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <p className="text-sm">{profile.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Location
              </label>
              <p className="text-sm">{profile.location}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm">{profile.description}</p>
            </div>
          </div>
        )}

        {isProfileEditing && (
          <form
            action={handleUpdateProfile}
            className="space-y-4 p-4 bg-card rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  name="name"
                  defaultValue={profile?.name || ""}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  name="location"
                  defaultValue={profile?.location || ""}
                  placeholder="San Francisco, CA"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                defaultValue={profile?.description || ""}
                placeholder="Professional description..."
                className="min-h-[100px]"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Profile Picture URL</label>
              <Input
                name="profilePictureUrl"
                defaultValue={profile?.profilePictureUrl || ""}
                placeholder="/uploads/profile.jpg"
                required
              />
            </div>
            <input
              type="hidden"
              name="socials"
              value={JSON.stringify(profile?.socials || [])}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Profile"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProfileEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Socials Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Social Links</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsSocialsEditing(!isSocialsEditing)}
          >
            {isSocialsEditing ? "Done" : "Manage Links"}
          </Button>
        </div>

        {!isSocialsEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socials.map((social) => (
              <div key={social.id} className="p-3 bg-card rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{social.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {social.url}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {socials.length === 0 && (
              <p className="text-sm text-muted-foreground md:col-span-2">
                No social links added yet.
              </p>
            )}
          </div>
        )}

        {isSocialsEditing && (
          <div className="space-y-4">
            {/* Add Social Form */}
            <form
              action={handleCreateSocial}
              className="p-4 bg-card rounded-lg"
            >
              <h4 className="font-medium mb-3">Add New Social Link</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Platform</label>
                  <Input name="name" placeholder="LinkedIn" required />
                </div>
                <div>
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    name="url"
                    type="url"
                    placeholder="https://linkedin.com/in/johndoe"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="mt-4" disabled={isPending}>
                {isPending ? "Adding..." : "Add Link"}
              </Button>
            </form>

            {/* Existing Socials */}
            <div className="space-y-2">
              {socials.map((social) => (
                <div
                  key={social.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{social.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {social.url}
                    </p>
                  </div>
                  <form action={handleDeleteSocial}>
                    <input type="hidden" name="id" value={social.id} />
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                    >
                      Delete
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
