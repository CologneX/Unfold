"use client";

import { useState, useCallback, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Languages,
  Shield,
  Network,
  Save,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  User,
  X,
} from "lucide-react";

import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { AppFormField, AppFieldGrid } from "./form-field";
import { CusFormSection, ModernFormItem } from "./form-section";
import { CVSection } from "./cv-section";
import BadgeCombobox from "@/components/custom/badge-combobox";
import MonthPicker from "@/components/custom/month-picker";
import { SelectResponsive } from "@/components/custom/res-select";

import {
  type ComboboxItem,
  type Technology,
  type Role,
  Data,
  DataSchema,
} from "@/types/types";
import { createTechnology, createRole, updateCV } from "@/app/actions";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/custom/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";

interface CurriculumVitaeEditFormProps {
  CV: Data | null;
  availableTechnologies: Technology[];
  availableRoles: Role[];
}

const formSteps = [
  {
    id: "profile",
    title: "Profile",
    description: "Your personal information",
    icon: User,
  },
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
}: CurriculumVitaeEditFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const form = useForm<Data>({
    resolver: zodResolver(DataSchema),
    defaultValues: {
      profile: CV?.profile || {
        name: "",
        description: "",
        email: "",
        profilePictureUrl: "",
        location: "",
        socials: [],
      },
      cv: {
        technologies: availableTechnologies,
        roles: availableRoles,
        workExperiences: CV?.cv?.workExperiences || [],
        educations: CV?.cv.educations || [],
        certifications: CV?.cv.certifications || [],
        awardOrHonors: CV?.cv.awardOrHonors || [],
        publications: CV?.cv.publications || [],
        languages: CV?.cv.languages || [],
      },
      projects: CV?.projects || [],
    },
  });

  // Field arrays for array fields
  const {
    fields: workFields,
    append: addWork,
    remove: removeWork,
  } = useFieldArray({
    control: form.control,
    name: "cv.workExperiences",
  });

  const {
    fields: educationFields,
    append: addEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "cv.educations",
  });

  const {
    fields: certificationFields,
    append: addCertification,
    remove: removeCertification,
  } = useFieldArray({
    control: form.control,
    name: "cv.certifications",
  });

  const {
    fields: awardFields,
    append: addAward,
    remove: removeAward,
  } = useFieldArray({
    control: form.control,
    name: "cv.awardOrHonors",
  });

  const {
    fields: publicationFields,
    append: addPublication,
    remove: removePublication,
  } = useFieldArray({
    control: form.control,
    name: "cv.publications",
  });

  const {
    fields: languageFields,
    append: addLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control: form.control,
    name: "cv.languages",
  });

  const {
    fields: socialFields,
    append: addSocial,
    remove: removeSocial,
  } = useFieldArray({
    control: form.control,
    name: "profile.socials",
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
  const onSubmit = useCallback((data: Data) => {
    startTransition(async () => {
      setIsSuccess(false);
      try {
        await updateCV(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSuccess(true);
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
      <div className="bg-background/50 border rounded-md my-4">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edit CV</h1>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {formSteps.length}:{" "}
                {formSteps[currentStep].description}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              {isSuccess && (
                <div className="flex items-center gap-2 justify-items-end justify-end text-sm text-green-500 ">
                  <CheckCircle2 className="h-4 w-4 " />
                  CV updated successfully
                </div>
              )}
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
              {/* Profile Step */}
              {currentStep === 0 && (
                <CVSection delay={0}>
                  <div className="space-y-8">
                    {/* Profile Section */}
                    <CusFormSection
                      title="Profile Information"
                      description="Your personal information and professional summary"
                      icon={<User className="h-5 w-5" />}
                    >
                      <AppFieldGrid cols={2}>
                        <FormField
                          control={form.control}
                          name="profile.name"
                          render={({ field }) => (
                            <AppFormField label="Full Name">
                              <Input
                                {...field}
                                placeholder="John Doe"
                                required
                              />
                            </AppFormField>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="profile.location"
                          render={({ field }) => (
                            <AppFormField label="Location">
                              <Input
                                {...field}
                                placeholder="San Francisco, CA"
                                required
                              />
                            </AppFormField>
                          )}
                        />
                      </AppFieldGrid>
                      <FormField
                        control={form.control}
                        name="profile.email"
                        render={({ field }) => (
                          <AppFormField label="Email">
                            <Input
                              {...field}
                              placeholder="john.doe@example.com"
                              required
                            />
                          </AppFormField>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="profile.description"
                        render={({ field }) => (
                          <AppFormField
                            label="Professional Description"
                            description="A brief summary of your professional background and expertise"
                          >
                            <Textarea
                              {...field}
                              placeholder="Passionate software developer with expertise in modern web technologies..."
                              className="min-h-[120px] resize-none"
                              required
                            />
                          </AppFormField>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="profile.profilePictureUrl"
                        render={({ field }) => (
                          <AppFormField
                            label="Profile Picture URL"
                            description="URL to your profile picture (optional)"
                          >
                            <ImageUpload
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </AppFormField>
                        )}
                      />
                    </CusFormSection>

                    {/* Social Links Section */}
                    <CusFormSection
                      title="Social Links"
                      description="Your professional social media and portfolio links"
                      onAdd={() =>
                        addSocial({
                          id: crypto.randomUUID(),
                          name: "",
                          url: "",
                        })
                      }
                      addLabel="Add Social Link"
                      icon={<Network className="h-5 w-5" />}
                    >
                      <div className="space-y-6">
                        {/* Existing Social Links */}
                        {socialFields.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Current Social Links
                            </h4>
                            <div className="space-y-2">
                              {socialFields.map((social, index) => (
                                <AppFieldGrid cols={2} key={social.id}>
                                  <FormField
                                    control={form.control}
                                    name={`profile.socials.${index}.name`}
                                    render={({ field }) => (
                                      <AppFormField label="Platform">
                                        <Input {...field} />
                                      </AppFormField>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`profile.socials.${index}.url`}
                                    render={({ field }) => (
                                      <AppFormField label="URL">
                                        <div className="flex items-center gap-2">
                                          <Input {...field} />
                                          <Button
                                            variant="outline"
                                            type="button"
                                            size="icon"
                                            onClick={() => removeSocial(index)}
                                          >
                                            <X className="size-4" />
                                          </Button>
                                        </div>
                                      </AppFormField>
                                    )}
                                  />
                                </AppFieldGrid>
                              ))}
                            </div>
                          </div>
                        )}

                        {socialFields.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Network className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                              No social links added yet.
                            </p>
                            <p className="text-xs">
                              Add your first social link above.
                            </p>
                          </div>
                        )}
                      </div>
                    </CusFormSection>
                  </div>
                </CVSection>
              )}

              {/* Experience Step */}
              {currentStep === 1 && (
                <CVSection delay={0}>
                  <CusFormSection
                    title="Work Experience"
                    description="Your professional work history and achievements"
                    icon={<Briefcase className="h-5 w-5" />}
                    onAdd={() =>
                      addWork({
                        id: crypto.randomUUID(),
                        name: "",
                        company: "",
                        location: "",
                        type: undefined,
                        description: "",
                        startDate: new Date(),
                        endDate: undefined,
                        isCurrent: false,
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
                        <AppFieldGrid cols={2}>
                          <FormField
                            control={form.control}
                            name={`cv.workExperiences.${index}.name`}
                            render={({ field }) => (
                              <AppFormField label="Position/Role">
                                <Input
                                  {...field}
                                  placeholder="Senior Software Engineer"
                                />
                              </AppFormField>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`cv.workExperiences.${index}.company`}
                            render={({ field }) => (
                              <AppFormField label="Company">
                                <Input {...field} placeholder="Google Inc." />
                              </AppFormField>
                            )}
                          />
                        </AppFieldGrid>

                        <AppFieldGrid cols={2}>
                          <FormField
                            control={form.control}
                            name={`cv.workExperiences.${index}.location`}
                            render={({ field }) => (
                              <AppFormField label="Location (Optional)">
                                <Input
                                  {...field}
                                  placeholder="San Francisco, CA"
                                />
                              </AppFormField>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`cv.workExperiences.${index}.type`}
                            render={({ field }) => (
                              <AppFormField label="Employment Type (Optional)">
                                <SelectResponsive
                                  value={field.value || null!}
                                  onChange={field.onChange}
                                  options={[
                                    { value: null!, label: "Select Type" },
                                    { value: "Full-time", label: "Full-time" },
                                    { value: "Part-time", label: "Part-time" },
                                    { value: "Freelance", label: "Freelance" },
                                    {
                                      value: "Internship",
                                      label: "Internship",
                                    },
                                    { value: "Volunteer", label: "Volunteer" },
                                    { value: "Contract", label: "Contract" },
                                    { value: "Other", label: "Other" },
                                  ]}
                                  placeholder="Select employment type"
                                />
                              </AppFormField>
                            )}
                          />
                        </AppFieldGrid>
                        <AppFieldGrid cols={2} className="items-start">
                          <AppFormField label="Start Date">
                            <FormField
                              control={form.control}
                              name={`cv.workExperiences.${index}.startDate`}
                              render={({ field }) => (
                                <MonthPicker
                                  currentMonth={field.value}
                                  onMonthChange={field.onChange}
                                />
                              )}
                            />
                          </AppFormField>
                          <div className="flex flex-col gap-2">
                            <AppFormField label="End Date (Optional)">
                              <FormField
                                disabled={form.watch(
                                  `cv.workExperiences.${index}.isCurrent`
                                )}
                                control={form.control}
                                name={`cv.workExperiences.${index}.endDate`}
                                render={({ field }) => (
                                  <MonthPicker
                                    disabled={form.watch(
                                      `cv.workExperiences.${index}.isCurrent`
                                    )}
                                    minMonth={form.watch(
                                      `cv.workExperiences.${index}.startDate`
                                    )}
                                    currentMonth={field.value}
                                    onMonthChange={field.onChange}
                                  />
                                )}
                              />
                            </AppFormField>
                            <FormField
                              control={form.control}
                              name={`cv.workExperiences.${index}.isCurrent`}
                              render={({ field }) => (
                                <AppFormField>
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={field.value || false}
                                      onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        if (checked) {
                                          form.setValue(
                                            `cv.workExperiences.${index}.endDate`,
                                            undefined
                                          );
                                        }
                                      }}
                                    />
                                    <FormLabel>
                                      I currently work in this position
                                    </FormLabel>
                                  </div>
                                </AppFormField>
                              )}
                            />
                          </div>
                        </AppFieldGrid>

                        <FormField
                          control={form.control}
                          name={`cv.workExperiences.${index}.description`}
                          render={({ field }) => (
                            <AppFormField
                              label="Description"
                              description="Describe your responsibilities, achievements, and impact"
                            >
                              <Textarea
                                {...field}
                                placeholder="Led a team of 5 engineers to develop..."
                                className="min-h-[100px] resize-none"
                              />
                            </AppFormField>
                          )}
                        />
                      </ModernFormItem>
                    ))}
                  </CusFormSection>
                </CVSection>
              )}

              {/* Education Step */}
              {currentStep === 2 && (
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
                        location: "",
                        degree: "",
                        startDate: new Date(),
                        endDate: undefined,
                        isCurrent: false,
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
                        <AppFieldGrid cols={2}>
                          <FormField
                            control={form.control}
                            name={`cv.educations.${index}.name`}
                            render={({ field }) => (
                              <AppFormField label="Program/Course">
                                <Input
                                  {...field}
                                  placeholder="Computer Science"
                                />
                              </AppFormField>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`cv.educations.${index}.institution`}
                            render={({ field }) => (
                              <AppFormField label="Institution">
                                <Input
                                  {...field}
                                  placeholder="Stanford University"
                                />
                              </AppFormField>
                            )}
                          />
                        </AppFieldGrid>

                        <AppFieldGrid cols={2}>
                          <FormField
                            control={form.control}
                            name={`cv.educations.${index}.degree`}
                            render={({ field }) => (
                              <AppFormField label="Degree">
                                <Input
                                  {...field}
                                  placeholder="Bachelor of Science"
                                />
                              </AppFormField>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`cv.educations.${index}.location`}
                            render={({ field }) => (
                              <AppFormField label="Location (Optional)">
                                <Input {...field} placeholder="Stanford, CA" />
                              </AppFormField>
                            )}
                          />
                        </AppFieldGrid>

                        <AppFieldGrid cols={2} className="items-start">
                          <AppFormField label="Start Date">
                            <MonthPicker
                              currentMonth={form.watch(
                                `cv.educations.${index}.startDate`
                              )}
                              onMonthChange={(date: Date) =>
                                form.setValue(
                                  `cv.educations.${index}.startDate`,
                                  date
                                )
                              }
                            />
                          </AppFormField>
                          <div className="flex flex-col gap-2">
                            <AppFormField label="End Date (Optional)">
                              <FormField
                                disabled={form.watch(
                                  `cv.educations.${index}.isCurrent`
                                )}
                                control={form.control}
                                name={`cv.educations.${index}.endDate`}
                                render={({ field }) => (
                                  <MonthPicker
                                    disabled={form.watch(
                                      `cv.educations.${index}.isCurrent`
                                    )}
                                    minMonth={form.watch(
                                      `cv.educations.${index}.startDate`
                                    )}
                                    currentMonth={field.value}
                                    onMonthChange={field.onChange}
                                  />
                                )}
                              />
                            </AppFormField>
                            <FormField
                              control={form.control}
                              name={`cv.educations.${index}.isCurrent`}
                              render={({ field }) => (
                                <AppFormField>
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={field.value || false}
                                      onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        if (checked) {
                                          form.setValue(
                                            `cv.educations.${index}.endDate`,
                                            undefined
                                          );
                                        }
                                      }}
                                    />
                                    <FormLabel>
                                      I&apos;m currently enrolled
                                    </FormLabel>
                                  </div>
                                </AppFormField>
                              )}
                            />
                          </div>
                        </AppFieldGrid>
                      </ModernFormItem>
                    ))}
                  </CusFormSection>
                </CVSection>
              )}

              {/* Skills Step */}
              {currentStep === 3 && (
                <CVSection delay={0}>
                  <div className="space-y-8">
                    <CusFormSection
                      title="Technologies"
                      description="Programming languages, frameworks, and tools you work with"
                      icon={<Network className="h-5 w-5" />}
                    >
                      <AppFormField label="Technologies & Tools">
                        <BadgeCombobox
                          value={form.watch("cv.technologies").map((tech) => ({
                            value: tech.name,
                            label: tech.name,
                          }))}
                          data={technologyOptions}
                          onChange={(items) => {
                            form.setValue(
                              "cv.technologies",
                              items.map((item) => ({ name: item.label }))
                            );
                          }}
                          onAddNew={handleAddTechnology}
                          placeholder="Select technologies..."
                          searchPlaceholder="Search technologies..."
                          emptyMessage="No technologies found. Type to add a new one."
                        />
                      </AppFormField>
                    </CusFormSection>

                    <CusFormSection
                      title="Roles & Expertise"
                      description="Your professional roles and areas of expertise"
                      icon={<Briefcase className="h-5 w-5" />}
                    >
                      <AppFormField label="Professional Roles">
                        <BadgeCombobox
                          value={form.watch("cv.roles").map((role) => ({
                            value: role.name,
                            label: role.name,
                          }))}
                          data={roleOptions}
                          onChange={(items) => {
                            form.setValue(
                              "cv.roles",
                              items.map((item) => ({ name: item.label }))
                            );
                          }}
                          onAddNew={handleAddRole}
                          placeholder="Select roles..."
                          searchPlaceholder="Search roles..."
                          emptyMessage="No roles found. Type to add a new one."
                        />
                      </AppFormField>
                    </CusFormSection>
                  </div>
                </CVSection>
              )}

              {/* Achievements Step */}
              {currentStep === 4 && (
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
                          <AppFieldGrid cols={2}>
                            <FormField
                              control={form.control}
                              name={`cv.certifications.${index}.name`}
                              render={({ field }) => (
                                <AppFormField label="Certification Name">
                                  <Input
                                    {...field}
                                    placeholder="AWS Solutions Architect"
                                  />
                                </AppFormField>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`cv.certifications.${index}.issuer`}
                              render={({ field }) => (
                                <AppFormField label="Issuing Organization">
                                  <Input
                                    {...field}
                                    placeholder="Amazon Web Services"
                                  />
                                </AppFormField>
                              )}
                            />
                          </AppFieldGrid>

                          <AppFieldGrid cols={2}>
                            <AppFormField label="Issue Date">
                              <MonthPicker
                                currentMonth={form.watch(
                                  `cv.certifications.${index}.startDate`
                                )}
                                onMonthChange={(date: Date) =>
                                  form.setValue(
                                    `cv.certifications.${index}.startDate`,
                                    date
                                  )
                                }
                              />
                            </AppFormField>
                            <AppFormField label="Expiry Date (Optional)">
                              <MonthPicker
                                currentMonth={form.watch(
                                  `cv.certifications.${index}.endDate`
                                )}
                                onMonthChange={(date: Date) =>
                                  form.setValue(
                                    `cv.certifications.${index}.endDate`,
                                    date
                                  )
                                }
                              />
                            </AppFormField>
                          </AppFieldGrid>

                          <AppFieldGrid cols={2}>
                            <FormField
                              control={form.control}
                              name={`cv.certifications.${index}.credentialId`}
                              render={({ field }) => (
                                <AppFormField label="Credential ID (Optional)">
                                  <Input {...field} placeholder="ABC123XYZ" />
                                </AppFormField>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`cv.certifications.${index}.url`}
                              render={({ field }) => (
                                <AppFormField label="Verification URL (Optional)">
                                  <Input
                                    {...field}
                                    placeholder="https://verify.example.com"
                                  />
                                </AppFormField>
                              )}
                            />
                          </AppFieldGrid>
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
                          <AppFieldGrid cols={2}>
                            <FormField
                              control={form.control}
                              name={`cv.awardOrHonors.${index}.name`}
                              render={({ field }) => (
                                <AppFormField label="Award Name">
                                  <Input
                                    {...field}
                                    placeholder="Employee of the Year"
                                  />
                                </AppFormField>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`cv.awardOrHonors.${index}.institution`}
                              render={({ field }) => (
                                <AppFormField label="Awarding Institution">
                                  <Input
                                    {...field}
                                    placeholder="Company Name"
                                  />
                                </AppFormField>
                              )}
                            />
                          </AppFieldGrid>

                          <AppFormField label="Date Received">
                            <MonthPicker
                              currentMonth={form.watch(
                                `cv.awardOrHonors.${index}.date`
                              )}
                              onMonthChange={(date: Date) =>
                                form.setValue(
                                  `cv.awardOrHonors.${index}.date`,
                                  date
                                )
                              }
                            />
                          </AppFormField>

                          <FormField
                            control={form.control}
                            name={`cv.awardOrHonors.${index}.description`}
                            render={({ field }) => (
                              <AppFormField
                                label="Description (Optional)"
                                description="Brief description of the award and why you received it"
                              >
                                <Textarea
                                  {...field}
                                  placeholder="Recognized for outstanding performance..."
                                  className="min-h-[100px] resize-none"
                                />
                              </AppFormField>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`cv.awardOrHonors.${index}.url`}
                            render={({ field }) => (
                              <AppFormField label="URL (Optional)">
                                <Input
                                  {...field}
                                  placeholder="https://award.example.com"
                                />
                              </AppFormField>
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
                            name={`cv.publications.${index}.title`}
                            render={({ field }) => (
                              <AppFormField label="Title">
                                <Input
                                  {...field}
                                  placeholder="A Study on Modern Web Development"
                                />
                              </AppFormField>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`cv.publications.${index}.authors`}
                            render={({ field }) => (
                              <AppFormField
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
                              </AppFormField>
                            )}
                          />

                          <AppFieldGrid cols={2}>
                            <AppFormField label="Publication Date">
                              <MonthPicker
                                currentMonth={form.watch(
                                  `cv.publications.${index}.date`
                                )}
                                onMonthChange={(date: Date) =>
                                  form.setValue(
                                    `cv.publications.${index}.date`,
                                    date
                                  )
                                }
                              />
                            </AppFormField>
                            <FormField
                              control={form.control}
                              name={`cv.publications.${index}.url`}
                              render={({ field }) => (
                                <AppFormField label="URL (Optional)">
                                  <Input
                                    {...field}
                                    placeholder="https://publication.example.com"
                                  />
                                </AppFormField>
                              )}
                            />
                          </AppFieldGrid>
                        </ModernFormItem>
                      ))}
                    </CusFormSection>
                  </div>
                </CVSection>
              )}

              {/* Languages Step */}
              {currentStep === 5 && (
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
                        level: null,
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
                        <AppFieldGrid cols={2}>
                          <FormField
                            control={form.control}
                            name={`cv.languages.${index}.name`}
                            render={({ field }) => (
                              <AppFormField label="Language">
                                <Input {...field} placeholder="English" />
                              </AppFormField>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`cv.languages.${index}.proficiency`}
                            render={({ field }) => (
                              <AppFormField label="Proficiency Level">
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
                              </AppFormField>
                            )}
                          />
                        </AppFieldGrid>

                        <AppFieldGrid cols={2}>
                          <FormField
                            control={form.control}
                            name={`cv.languages.${index}.level`}
                            render={({ field }) => (
                              <AppFormField label="CEFR Level (Optional)">
                                <SelectResponsive
                                  value={field.value}
                                  onChange={field.onChange}
                                  options={[
                                    {
                                      value: null!,
                                      label: "Select Level",
                                    },
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
                              </AppFormField>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`cv.languages.${index}.url`}
                            render={({ field }) => (
                              <AppFormField label="Certificate URL (Optional)">
                                <Input
                                  {...field}
                                  placeholder="https://certificate.example.com"
                                />
                              </AppFormField>
                            )}
                          />
                        </AppFieldGrid>
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
